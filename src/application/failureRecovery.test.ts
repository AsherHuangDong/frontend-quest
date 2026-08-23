import { beforeEach, describe, expect, it } from 'vitest';

const storage: Record<string, string> = {};

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem(key: string) {
      return storage[key] ?? null;
    },
    setItem(key: string, value: string) {
      storage[key] = value;
    },
    removeItem(key: string) {
      delete storage[key];
    },
    clear() {
      Object.keys(storage).forEach((key) => delete storage[key]);
    },
  },
});

import { useGameStore } from './gameStore';
import { quests } from '../content/quests';

describe('Failure Recovery flow', () => {
  beforeEach(() => {
    localStorage.clear();

    useGameStore.setState({
      runtime: null,
      player: { id: 'player-test', name: 'Test Player', xp: 0 },
      progress: Object.fromEntries(
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
      ),
      skillEvidence: [],
      skillMastery: {},
      currentStreak: 0,
      bestStreak: 0,
    });
  });

  it('keeps evaluation feedback after a failed submission', () => {
    const quest = quests[0];

    useGameStore.getState().startQuest(quest.id);
    useGameStore.getState().selectAnswer('A');
    useGameStore.getState().submitAnswer();

    const result = useGameStore.getState().runtime?.result;

    expect(result).not.toBeNull();
    expect(result?.passed).toBe(false);
    expect(result?.feedback).toBeTruthy();
  });

  it('recovers to a new attempt after retry', () => {
    const quest = quests[0];

    useGameStore.getState().startQuest(quest.id);
    useGameStore.getState().selectAnswer('A');
    useGameStore.getState().submitAnswer();
    useGameStore.getState().retryQuest();

    expect(useGameStore.getState().runtime).toEqual({
      questId: quest.id,
      selectedAnswer: null,
      result: null,
    });
  });

  it('provides hints from quest content when available', () => {
    expect(quests[0].hints?.length).toBeGreaterThan(0);
  });
});
