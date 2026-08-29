import { create } from 'zustand';
import type { EvaluationResult, Quest } from '../domain/quest/types';
import type { Player } from '../domain/player/types';
import type { ProgressMap } from '../domain/progress/types';
import type { BossProgress } from '../domain/boss/types';
import type { SkillEvidence, SkillMasteryMap } from '../domain/skill/types';
import type { CalibrationAnswer, CalibrationResult } from '../domain/calibration/types';
import type { AdventureChapter } from '../domain/adventure/types';
import { applyQuestOutcomeToReview } from '../domain/review/review';
import { advanceStreak, resetStreak } from '../domain/player/streak';
import { completePhase, createBossProgress, startBoss } from '../domain/boss/stateMachine';
import { asyncBoss } from '../content/bosses/asyncBoss';
import { quests } from '../content/quests';
import { asyncWorldCalibration } from '../content/calibration/asyncWorld';
import { submitQuest } from './useCases/submitQuest';
import { recordQuestSkillEvidence } from './useCases/recordQuestSkillEvidence';
import { completeCalibration } from './useCases/completeCalibration';
import { completeAdventure } from './useCases/completeAdventure';
import { mergeQuestProgress } from './progressMigration';
import { LocalStorageGameRepository } from '../infrastructure/persistence/localStorageGameRepository';
import {
  createDefaultAdaptiveState,
  normalizeAdaptiveState,
  touchAdaptiveActivity,
  type AdaptiveSaveState,
  type GameSave,
} from '../infrastructure/persistence/gameRepository';

interface QuestRuntime {
  questId: string;
  selectedAnswer: string | null;
  result: EvaluationResult | null;
  hintsUsed: number;
  bossPhaseId: string | null;
}

interface GameState {
  player: Player;
  progress: ProgressMap;
  skillEvidence: SkillEvidence[];
  skillMastery: SkillMasteryMap;
  currentStreak: number;
  bestStreak: number;
  bossProgress: BossProgress;
  adaptive: AdaptiveSaveState;
  runtime: QuestRuntime | null;
  startQuest: (questId: string) => void;
  startBossPhase: () => void;
  startBoss: () => void;
  selectAnswer: (answer: string) => void;
  useHint: () => void;
  submitAnswer: () => void;
  retryQuest: () => void;
  exitQuest: () => void;
  finishCalibration: (answers: CalibrationAnswer[], completedAt?: string) => CalibrationResult;
  completeAdventureChapter: (chapter: AdventureChapter) => { awardedXp: number; alreadyCleared: boolean };
}

const repository = new LocalStorageGameRepository();

function createInitialProgress(): ProgressMap {
  return mergeQuestProgress({}, quests);
}

function toSave(state: {
  player: Player;
  progress: ProgressMap;
  skillEvidence: SkillEvidence[];
  skillMastery: SkillMasteryMap;
  currentStreak: number;
  bestStreak: number;
  bossProgress: BossProgress;
  adaptive: AdaptiveSaveState;
}): GameSave {
  return {
    version: 1,
    player: state.player,
    progress: state.progress,
    learning: {
      skillEvidence: state.skillEvidence,
      skillMastery: state.skillMastery,
    },
    gameplay: {
      currentStreak: state.currentStreak,
      bestStreak: state.bestStreak,
      bossProgress: state.bossProgress,
    },
    adaptive: state.adaptive,
  };
}

function loadSave(): GameSave {
  const save = repository.load();
  if (save) {
    return {
      ...save,
      learning: save.learning ?? { skillEvidence: [], skillMastery: {} },
      progress: mergeQuestProgress(save.progress, quests),
      gameplay: save.gameplay ?? { currentStreak: 0, bestStreak: 0 },
      adaptive: normalizeAdaptiveState(save.adaptive),
    };
  }

  return {
    version: 1,
    player: { id: 'player-1', name: 'Frontend Knight', xp: 0 },
    progress: createInitialProgress(),
    learning: { skillEvidence: [], skillMastery: {} },
    gameplay: { currentStreak: 0, bestStreak: 0 },
    adaptive: createDefaultAdaptiveState(),
  };
}

const initialSave = loadSave();
const initialBossProgress = initialSave.gameplay.bossProgress ?? createBossProgress(asyncBoss.id);

export const useGameStore = create<GameState>((set, get) => ({
  player: initialSave.player,
  progress: initialSave.progress,
  skillEvidence: initialSave.learning.skillEvidence,
  skillMastery: initialSave.learning.skillMastery,
  currentStreak: initialSave.gameplay.currentStreak,
  bestStreak: initialSave.gameplay.bestStreak,
  bossProgress: initialBossProgress,
  adaptive: normalizeAdaptiveState(initialSave.adaptive),
  runtime: null,

  startQuest: (questId) => {
    const progress = get().progress[questId];
    if (!progress || progress.status === 'locked') return;
    const adaptive = touchAdaptiveActivity(get().adaptive);
    const current = get();
    repository.save(
      toSave({
        player: current.player,
        progress: current.progress,
        skillEvidence: current.skillEvidence,
        skillMastery: current.skillMastery,
        currentStreak: current.currentStreak,
        bestStreak: current.bestStreak,
        bossProgress: current.bossProgress,
        adaptive,
      }),
    );
    set({
      adaptive,
      runtime: {
        questId,
        selectedAnswer: null,
        result: null,
        hintsUsed: 0,
        bossPhaseId: null,
      },
    });
  },

  startBoss: () => {
    const bossProgress = get().bossProgress;
    const started = startBoss(bossProgress);
    if (started === bossProgress) return;
    const current = get();
    repository.save(
      toSave({
        player: current.player,
        progress: current.progress,
        skillEvidence: current.skillEvidence,
        skillMastery: current.skillMastery,
        currentStreak: current.currentStreak,
        bestStreak: current.bestStreak,
        bossProgress: started,
        adaptive: current.adaptive,
      }),
    );
    set({ bossProgress: started });
  },

  startBossPhase: () => {
    const { bossProgress } = get();
    if (bossProgress.status === 'CLEARED') return;
    const phase = asyncBoss.phases[bossProgress.currentPhaseIndex];
    const questId = phase?.questIds[0];
    if (!phase || !questId) return;
    const questProgress = get().progress[questId];
    if (!questProgress || questProgress.status === 'locked') return;
    const started = bossProgress.status === 'AVAILABLE' ? startBoss(bossProgress) : bossProgress;
    set({
      bossProgress: started,
      runtime: {
        questId,
        selectedAnswer: null,
        result: null,
        hintsUsed: 0,
        bossPhaseId: phase.id,
      },
    });
  },

  selectAnswer: (answer) => {
    const { runtime } = get();
    if (!runtime || runtime.result) return;
    set({ runtime: { ...runtime, selectedAnswer: answer } });
  },

  useHint: () => {
    const { runtime } = get();
    if (!runtime || runtime.result) return;
    const quest = quests.find((item) => item.id === runtime.questId);
    if (!quest?.hints?.length || runtime.hintsUsed >= quest.hints.length) return;
    set({ runtime: { ...runtime, hintsUsed: runtime.hintsUsed + 1 } });
  },

  submitAnswer: () => {
    const {
      runtime,
      player,
      progress,
      skillEvidence,
      currentStreak,
      bestStreak,
      bossProgress,
      adaptive,
    } = get();
    if (!runtime || runtime.result || !runtime.selectedAnswer) return;

    const quest = quests.find((item) => item.id === runtime.questId);
    if (!quest) return;

    const previous = progress[quest.id];
    const wasCleared = previous?.status === 'cleared';
    const result = submitQuest(quest, runtime.selectedAnswer, player, progress, runtime.hintsUsed);
    const passed = result.evaluation.passed;

    const nextQuestProgress =
      wasCleared && !passed
        ? { ...result.progress, status: 'cleared' as const }
        : result.progress;
    const nextProgress = { ...progress, [quest.id]: nextQuestProgress };

    for (const unlockedQuestId of result.unlockedQuestIds) {
      const current = nextProgress[unlockedQuestId];
      if (current?.status === 'locked') {
        nextProgress[unlockedQuestId] = { ...current, status: 'available' };
      }
    }

    const streak = !passed
      ? resetStreak(bestStreak)
      : advanceStreak(currentStreak, bestStreak, !wasCleared);
    const replayAdjustment = passed && wasCleared ? -quest.reward.xp : 0;
    let nextPlayer = {
      ...result.player,
      xp: result.player.xp + streak.bonusXp + replayAdjustment,
    };
    let nextBossProgress = bossProgress;

    if (runtime.bossPhaseId) {
      nextBossProgress = completePhase(asyncBoss, bossProgress, result.evaluation.score);
      if (nextBossProgress.status === 'CLEARED' && bossProgress.status !== 'CLEARED') {
        nextPlayer = { ...nextPlayer, xp: nextPlayer.xp + asyncBoss.rewardXp };
      }
    }

    const learningResult = recordQuestSkillEvidence(quest, result.evaluation, skillEvidence);
    const nextReview = applyQuestOutcomeToReview(
      adaptive.review,
      quest.knowledgeNodeIds,
      passed,
    );
    const nextAdaptive: AdaptiveSaveState = touchAdaptiveActivity({
      ...adaptive,
      review: nextReview,
    });

    const nextState = {
      player: nextPlayer,
      progress: nextProgress,
      skillEvidence: [...skillEvidence, ...learningResult.evidence],
      skillMastery: learningResult.mastery,
      currentStreak: streak.current,
      bestStreak: streak.best,
      bossProgress: nextBossProgress,
      adaptive: nextAdaptive,
    };

    repository.save(toSave(nextState));

    set({
      ...nextState,
      runtime: { ...runtime, result: result.evaluation },
    });
  },

  retryQuest: () => {
    const { runtime } = get();
    if (!runtime) return;
    set({
      runtime: {
        ...runtime,
        selectedAnswer: null,
        result: null,
        hintsUsed: 0,
      },
    });
  },

  exitQuest: () => set({ runtime: null }),

  finishCalibration: (answers, completedAt) => {
    const result = completeCalibration(asyncWorldCalibration, answers, completedAt);
    const current = get();
    const nextAdaptive: AdaptiveSaveState = touchAdaptiveActivity({
      ...current.adaptive,
      calibration: result,
    });
    const nextState = {
      player: current.player,
      progress: current.progress,
      skillEvidence: current.skillEvidence,
      skillMastery: current.skillMastery,
      currentStreak: current.currentStreak,
      bestStreak: current.bestStreak,
      bossProgress: current.bossProgress,
      adaptive: nextAdaptive,
    };
    repository.save(toSave(nextState));
    set({ adaptive: nextAdaptive });
    return result;
  },

  completeAdventureChapter: (chapter) => {
    const current = get();
    const outcome = completeAdventure({
      chapter,
      player: current.player,
      progress: current.progress,
      skillEvidence: current.skillEvidence,
      currentStreak: current.currentStreak,
      bestStreak: current.bestStreak,
      review: current.adaptive.review,
    });

    const nextAdaptive: AdaptiveSaveState = touchAdaptiveActivity({
      ...current.adaptive,
      review: outcome.review,
    });

    const nextState = {
      player: outcome.player,
      progress: outcome.progress,
      skillEvidence: outcome.skillEvidence,
      skillMastery: outcome.skillMastery,
      currentStreak: outcome.currentStreak,
      bestStreak: outcome.bestStreak,
      bossProgress: current.bossProgress,
      adaptive: nextAdaptive,
    };

    repository.save(toSave(nextState));
    set(nextState);

    return {
      awardedXp: outcome.awardedXp,
      alreadyCleared: outcome.alreadyCleared,
    };
  },
}));

export function getQuest(questId: string): Quest | undefined {
  return quests.find((quest) => quest.id === questId);
}
