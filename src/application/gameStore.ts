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
  runtime: QuestRuntime | null;
  startQuest: (questId: string) => void;
  submitAnswer: (answer: string) => void;
  retryQuest: () => void;
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
  return repository.load() ?? {
    version: 1,
    player: { id: 'player-1', name: 'Frontend Knight', xp: 0 },
    progress: createInitialProgress(),
  };
}

const initialSave = loadSave();

export const useGameStore = create<GameState>((set, get) => ({
  player: initialSave.player,
  progress: initialSave.progress,
  runtime: null,

  startQuest: (questId) => {
    const progress = get().progress[questId];
    if (!progress || progress.status === 'locked') return;

    set({
      runtime: {
        questId,
        selectedAnswer: null,
        result: null,
      },
    });
  },

  submitAnswer: (answer) => {
    const { runtime, player, progress } = get();
    if (!runtime || runtime.result) return;

    const quest = quests.find((item) => item.id === runtime.questId);
    if (!quest) return;

    const result = submitQuest(quest, answer, player, progress);
    const nextProgress = { ...progress, [quest.id]: result.progress };

    for (const unlockedQuestId of result.unlockedQuestIds) {
      const current = nextProgress[unlockedQuestId];
      if (current?.status === 'locked') {
        nextProgress[unlockedQuestId] = { ...current, status: 'available' };
      }
    }

    repository.save({
      version: 1,
      player: result.player,
      progress: nextProgress,
    });

    set({
      player: result.player,
      progress: nextProgress,
      runtime: {
        ...runtime,
        selectedAnswer: answer,
        result: result.evaluation,
      },
    });
  },

  retryQuest: () => {
    const { runtime } = get();
    if (!runtime) return;

    set({
      runtime: {
        questId: runtime.questId,
        selectedAnswer: null,
        result: null,
      },
    });
  },
}));

export function getQuest(questId: string): Quest | undefined {
  return quests.find((quest) => quest.id === questId);
}

export function getPlayerLevel(player: Player): number {
  return Math.floor(player.xp / 100) + 1;
}
