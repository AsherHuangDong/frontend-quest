import { beforeEach, describe, expect, it, vi } from 'vitest';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  seed(key: string, value: unknown) {
    this.setItem(key, JSON.stringify(value));
  }
}

const storage = new MemoryStorage();

function installStorage() {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
}

async function loadStore() {
  vi.resetModules();
  return import('./gameStore');
}

describe('gameStore learning integration', () => {
  beforeEach(() => {
    storage.clear();
    installStorage();
  });

  it('records evidence and mastery when a quest is passed', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    const state = useGameStore.getState();

    expect(state.runtime?.result?.passed).toBe(true);
    expect(state.skillEvidence).toHaveLength(2);
    expect(state.skillEvidence.every((item) => item.passed && item.score === 100)).toBe(true);
    expect(state.skillMastery.recall?.score).toBe(100);
    expect(state.skillMastery.understand?.score).toBe(100);
  });

  it('records failed attempts without changing the quest clear state', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('A');
    useGameStore.getState().submitAnswer();

    const state = useGameStore.getState();

    expect(state.runtime?.result?.passed).toBe(false);
    expect(state.progress['promise-basics'].status).toBe('available');
    expect(state.skillEvidence).toHaveLength(2);
    expect(state.skillEvidence.every((item) => !item.passed)).toBe(true);
  });

  it('accumulates evidence across replay and recomputes mastery from all evidence', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();
    useGameStore.getState().retryQuest();
    useGameStore.getState().selectAnswer('A');
    useGameStore.getState().submitAnswer();

    const state = useGameStore.getState();

    expect(state.skillEvidence).toHaveLength(4);
    expect(state.skillMastery.recall?.evidenceCount).toBe(2);
    expect(state.skillMastery.recall?.score).toBe(50);
    expect(state.skillMastery.understand?.evidenceCount).toBe(2);
    expect(state.skillMastery.understand?.score).toBe(50);
  });

  it('keeps learning state after a new store instance loads the saved game', async () => {
    let storeModule = await loadStore();

    storeModule.useGameStore.getState().startQuest('promise-basics');
    storeModule.useGameStore.getState().selectAnswer('B');
    storeModule.useGameStore.getState().submitAnswer();

    vi.resetModules();
    storeModule = await import('./gameStore');

    const state = storeModule.useGameStore.getState();

    expect(state.skillEvidence).toHaveLength(2);
    expect(state.skillMastery.understand?.score).toBe(100);
  });

  it('loads a legacy save without learning state', async () => {
    storage.seed('frontend-quest:save', {
      version: 1,
      player: { id: 'player-1', name: 'Frontend Knight', xp: 50 },
      progress: {
        'promise-basics': {
          questId: 'promise-basics',
          status: 'cleared',
          attempts: 1,
          bestScore: 100,
          lastScore: 100,
          clearedAt: '2026-08-24T00:00:00.000Z',
        },
      },
      gameplay: { currentStreak: 1, bestStreak: 1 },
    });

    const { useGameStore } = await loadStore();
    const state = useGameStore.getState();

    expect(state.player.xp).toBe(50);
    expect(state.skillEvidence).toEqual([]);
    expect(state.skillMastery).toEqual({});
  });
});
