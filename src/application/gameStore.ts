import { create } from 'zustand';
import type { EvaluationResult, Quest } from '../domain/quest/types';
import type { Player } from '../domain/player/types';
import type { ProgressMap } from '../domain/progress/types';
import type { SkillEvidence, SkillMasteryMap } from '../domain/skill/types';
import type { CalibrationAnswer, CalibrationResult } from '../domain/calibration/types';
import { advanceStreak, resetStreak } from '../domain/player/streak';
import { quests } from '../content/quests';
import { asyncWorldCalibration } from '../content/calibration/asyncWorld';
import { submitQuest } from './useCases/submitQuest';
import { recordQuestSkillEvidence } from './useCases/recordQuestSkillEvidence';
import { completeCalibration } from './useCases/completeCalibration';
import { LocalStorageGameRepository } from '../infrastructure/persistence/localStorageGameRepository';
import {
  createDefaultAdaptiveState,
  normalizeAdaptiveState,
  type AdaptiveSaveState,
  type GameSave,
} from '../infrastructure/persistence/gameRepository';

interface QuestRuntime {
  questId: string;
  selectedAnswer: string | null;
  result: EvaluationResult | null;
}

interface GameState {
  player: Player;
  progress: ProgressMap;
  skillEvidence: SkillEvidence[];
  skillMastery: SkillMasteryMap;
  currentStreak: number;
  bestStreak: number;
  adaptive: AdaptiveSaveState;
  runtime: QuestRuntime | null;
  startQuest: (questId: string) => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: () => void;
  retryQuest: () => void;
  exitQuest: () => void;
  /** Persist calibration result only; no XP / evidence / progress mutation. */
  finishCalibration: (answers: CalibrationAnswer[], completedAt?: string) => CalibrationResult;
}

const repository = new LocalStorageGameRepository();

function createInitialProgress(): ProgressMap {
  return Object.fromEntries(
    quests.map((quest) => [
      quest.id,
      {
        questId: quest.id,
        status: quest.prerequisiteQuestIds.length === 0 ? 'available' : 'locked',
        attempts: 0,
        bestScore: 0,
        lastScore: null,
        clearedAt: null,
      },
    ]),
  );
}

function toSave(state: {
  player: Player;
  progress: ProgressMap;
  skillEvidence: SkillEvidence[];
  skillMastery: SkillMasteryMap;
  currentStreak: number;
  bestStreak: number;
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

export const useGameStore = create<GameState>((set, get) => ({
  player: initialSave.player,
  progress: initialSave.progress,
  skillEvidence: initialSave.learning.skillEvidence,
  skillMastery: initialSave.learning.skillMastery,
  currentStreak: initialSave.gameplay.currentStreak,
  bestStreak: initialSave.gameplay.bestStreak,
  adaptive: normalizeAdaptiveState(initialSave.adaptive),
  runtime: null,

  startQuest: (questId) => {
    const progress = get().progress[questId];
    if (!progress || progress.status === 'locked') return;

    set({ runtime: { questId, selectedAnswer: null, result: null } });
  },

  selectAnswer: (answer) => {
    const { runtime } = get();
    if (!runtime || runtime.result) return;
    set({ runtime: { ...runtime, selectedAnswer: answer } });
  },

  submitAnswer: () => {
    const { runtime, player, progress, skillEvidence, currentStreak, bestStreak, adaptive } =
      get();
    if (!runtime || runtime.result || !runtime.selectedAnswer) return;

    const quest = quests.find((item) => item.id === runtime.questId);
    if (!quest) return;

    const previous = progress[quest.id];
    const wasCleared = previous?.status === 'cleared';
    const result = submitQuest(quest, runtime.selectedAnswer, player, progress);
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
    const nextPlayer = {
      ...result.player,
      xp: result.player.xp + streak.bonusXp + replayAdjustment,
    };

    const learningResult = recordQuestSkillEvidence(quest, result.evaluation, skillEvidence);
    const nextLearning = {
      skillEvidence: [...skillEvidence, ...learningResult.evidence],
      skillMastery: learningResult.mastery,
    };

    const nextState = {
      player: nextPlayer,
      progress: nextProgress,
      skillEvidence: nextLearning.skillEvidence,
      skillMastery: nextLearning.skillMastery,
      currentStreak: streak.current,
      bestStreak: streak.best,
      adaptive,
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
    set({ runtime: { questId: runtime.questId, selectedAnswer: null, result: null } });
  },

  exitQuest: () => set({ runtime: null }),

  finishCalibration: (answers, completedAt) => {
    const result = completeCalibration(asyncWorldCalibration, answers, completedAt);
    const current = get();
    const nextAdaptive: AdaptiveSaveState = {
      ...current.adaptive,
      calibration: result,
    };

    const nextState = {
      player: current.player,
      progress: current.progress,
      skillEvidence: current.skillEvidence,
      skillMastery: current.skillMastery,
      currentStreak: current.currentStreak,
      bestStreak: current.bestStreak,
      adaptive: nextAdaptive,
    };

    repository.save(toSave(nextState));
    set({ adaptive: nextAdaptive });

    return result;
  },
}));

export function getQuest(questId: string): Quest | undefined {
  return quests.find((quest) => quest.id === questId);
}
