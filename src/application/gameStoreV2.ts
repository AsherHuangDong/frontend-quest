import { create } from 'zustand';
import type { EvaluationResult, Quest } from '../domain/quest/types';
import type { Player } from '../domain/player/types';
import type { ProgressMap } from '../domain/progress/types';
import type { BossProgress } from '../domain/boss/types';
import { advanceStreak, resetStreak } from '../domain/player/streak';
import { completePhase, createBossProgress, startBoss } from '../domain/boss/stateMachine';
import { asyncBoss } from '../content/bosses/asyncBoss';
import { quests } from '../content/quests';
import { submitQuest } from './useCases/submitQuest';
import { LocalStorageGameRepository } from '../infrastructure/persistence/localStorageGameRepository';
import type { GameSave } from '../infrastructure/persistence/gameRepository';

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
  currentStreak: number;
  bestStreak: number;
  bossProgress: BossProgress;
  runtime: QuestRuntime | null;
  startQuest: (questId: string) => void;
  startBossPhase: () => void;
  startBoss: () => void;
  selectAnswer: (answer: string) => void;
  useHint: () => void;
  submitAnswer: () => void;
  retryQuest: () => void;
  exitQuest: () => void;
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

function loadSave(): GameSave {
  const save = repository.load();
  if (save) {
    return {
      ...save,
      gameplay: save.gameplay ?? { currentStreak: 0, bestStreak: 0 },
    };
  }

  return {
    version: 1,
    player: { id: 'player-1', name: 'Frontend Knight', xp: 0 },
    progress: createInitialProgress(),
    gameplay: { currentStreak: 0, bestStreak: 0 },
  };
}

const initialSave = loadSave();
const initialBossProgress = initialSave.gameplay.bossProgress ?? createBossProgress(asyncBoss.id);

export const useGameStore = create<GameState>((set, get) => ({
  player: initialSave.player,
  progress: initialSave.progress,
  currentStreak: initialSave.gameplay.currentStreak,
  bestStreak: initialSave.gameplay.bestStreak,
  bossProgress: initialBossProgress,
  runtime: null,

  startQuest: (questId) => {
    const progress = get().progress[questId];
    if (!progress || progress.status === 'locked') return;
    set({ runtime: { questId, selectedAnswer: null, result: null, hintsUsed: 0, bossPhaseId: null } });
  },

  startBoss: () => {
    const bossProgress = get().bossProgress;
    const started = startBoss(bossProgress);
    if (started === bossProgress) return;
    repository.save({
      version: 1,
      player: get().player,
      progress: get().progress,
      gameplay: { currentStreak: get().currentStreak, bestStreak: get().bestStreak, bossProgress: started },
    });
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
      runtime: { questId, selectedAnswer: null, result: null, hintsUsed: 0, bossPhaseId: phase.id },
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
    const { runtime, player, progress, currentStreak, bestStreak, bossProgress } = get();
    if (!runtime || runtime.result || !runtime.selectedAnswer) return;

    const quest = quests.find((item) => item.id === runtime.questId);
    if (!quest) return;

    const previous = progress[quest.id];
    const wasCleared = previous?.status === 'cleared';
    const result = submitQuest(quest, runtime.selectedAnswer, player, progress, runtime.hintsUsed);
    const passed = result.evaluation.passed;

    const nextQuestProgress = wasCleared && !passed
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
    let nextPlayer = { ...result.player, xp: result.player.xp + streak.bonusXp + replayAdjustment };
    let nextBossProgress = bossProgress;

    if (runtime.bossPhaseId) {
      nextBossProgress = completePhase(asyncBoss, bossProgress, result.evaluation.score);
      if (nextBossProgress.status === 'CLEARED' && bossProgress.status !== 'CLEARED') {
        nextPlayer = { ...nextPlayer, xp: nextPlayer.xp + asyncBoss.rewardXp };
      }
    }

    repository.save({
      version: 1,
      player: nextPlayer,
      progress: nextProgress,
      gameplay: { currentStreak: streak.current, bestStreak: streak.best, bossProgress: nextBossProgress },
    });

    set({
      player: nextPlayer,
      progress: nextProgress,
      currentStreak: streak.current,
      bestStreak: streak.best,
      bossProgress: nextBossProgress,
      runtime: { ...runtime, result: result.evaluation },
    });
  },

  retryQuest: () => {
    const { runtime } = get();
    if (!runtime) return;
    set({ runtime: { ...runtime, selectedAnswer: null, result: null, hintsUsed: 0 } });
  },

  exitQuest: () => set({ runtime: null }),
}));

export function getQuest(questId: string): Quest | undefined {
  return quests.find((quest) => quest.id === questId);
}
