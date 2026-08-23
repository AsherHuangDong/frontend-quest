import { create } from 'zustand';
import type { EvaluationResult, Quest } from '../domain/quest/types';
import type { Player } from '../domain/player/types';
import type { ProgressMap } from '../domain/progress/types';
import { quests } from '../content/quests';
import { submitQuest } from './useCases/submitQuest';
import { LocalStorageGameRepository } from '../infrastructure/persistence/localStorageGameRepository';
import type { GameSave } from '../infrastructure/persistence/gameRepository';

interface QuestRuntime {
  questId: string;
  selectedAnswer: string | null;
  result: EvaluationResult | null;
}

interface GameState {
  player: Player;
  progress: ProgressMap;
  currentStreak: number;
  bestStreak: number;
  runtime: QuestRuntime | null;
  startQuest: (questId: string) => void;
  selectAnswer: (answer: string) => void;
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

export const useGameStore = create<GameState>((set, get) => ({
  player: initialSave.player,
  progress: initialSave.progress,
  currentStreak: initialSave.gameplay.currentStreak,
  bestStreak: initialSave.gameplay.bestStreak,
  runtime: null,

  startQuest: (questId) => {
    const progress = get().progress[questId];
    if (!progress || progress.status === 'locked') return;

    set({
      runtime: { questId, selectedAnswer: null, result: null },
    });
  },

  selectAnswer: (answer) => {
    const { runtime } = get();
    if (!runtime || runtime.result) return;

    set({ runtime: { ...runtime, selectedAnswer: answer } });
  },

  submitAnswer: () => {
    const { runtime, player, progress, currentStreak, bestStreak } = get();
    if (!runtime || runtime.result || !runtime.selectedAnswer) return;

    const quest = quests.find((item) => item.id === runtime.questId);
    if (!quest) return;

    const previous = progress[quest.id];
    const wasCleared = previous?.status === 'cleared';
    const result = submitQuest(quest, runtime.selectedAnswer, player, progress);
    const passed = result.evaluation.passed;

    // A cleared quest remains cleared even when replayed and answered incorrectly.
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

    const nextStreak = passed && !wasCleared ? currentStreak + 1 : passed ? currentStreak : 0;
    const nextBestStreak = Math.max(bestStreak, nextStreak);
    const streakBonus = passed && !wasCleared ? Math.min(nextStreak - 1, 4) * 10 : 0;
    const replayAdjustment = passed && wasCleared ? -quest.reward.xp : 0;
    const nextPlayer = {
      ...result.player,
      xp: result.player.xp + streakBonus + replayAdjustment,
    };

    repository.save({
      version: 1,
      player: nextPlayer,
      progress: nextProgress,
      gameplay: {
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
      },
    });

    set({
      player: nextPlayer,
      progress: nextProgress,
      currentStreak: nextStreak,
      bestStreak: nextBestStreak,
      runtime: { ...runtime, result: result.evaluation },
    });
  },

  retryQuest: () => {
    const { runtime } = get();
    if (!runtime) return;
    set({ runtime: { questId: runtime.questId, selectedAnswer: null, result: null } });
  },

  exitQuest: () => set({ runtime: null }),
}));

export function getQuest(questId: string): Quest | undefined {
  return quests.find((quest) => quest.id === questId);
}
