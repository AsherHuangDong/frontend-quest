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
}

const storage = new MemoryStorage();

function setupStorage() {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
}

async function loadStore() {
  vi.resetModules();
  return import('./gameStore');
}

describe('XP and progress flow', () => {
  beforeEach(() => {
    storage.clear();
    setupStorage();
  });

  it('adds xp and clears quest progress after a successful quest', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    const state = useGameStore.getState();

    expect(state.player.xp).toBeGreaterThan(0);
    expect(state.progress['promise-basics'].status).toBe('cleared');
  });

  it('does not add xp when a quest fails', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('A');
    useGameStore.getState().submitAnswer();

    expect(useGameStore.getState().player.xp).toBe(0);
    expect(useGameStore.getState().progress['promise-basics'].status).toBe('available');
  });

  it('does not duplicate xp after replaying a cleared quest', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    const firstXp = useGameStore.getState().player.xp;

    useGameStore.getState().retryQuest();
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    expect(useGameStore.getState().player.xp).toBe(firstXp);
  });
});
