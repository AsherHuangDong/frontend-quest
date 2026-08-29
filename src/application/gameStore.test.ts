import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from './gameStore';

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

describe('gameStore adaptive calibration', () => {
  beforeEach(() => {
    const storage = new MemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage,
    });
    useGameStore.setState({
      player: { id: 'player-1', name: 'Frontend Knight', xp: 0 },
      progress: {},
      skillEvidence: [],
      skillMastery: {},
      currentStreak: 0,
      bestStreak: 0,
      adaptive: { calibration: null, review: {} },
      runtime: null,
    });
  });

  it('finishCalibration persists result and does not add skill evidence or xp', () => {
    const beforeXp = useGameStore.getState().player.xp;
    const beforeEvidence = useGameStore.getState().skillEvidence.length;

    const result = useGameStore.getState().finishCalibration(
      [
        { questId: 'promise-basics', score: 100, passed: true },
        { questId: 'event-loop', score: 50, passed: false },
      ],
      '2026-08-30T12:00:00.000Z',
    );

    expect(result.level).toBe('beginner');
    expect(result.recommendedQuestId).toBe('event-loop');
    expect(useGameStore.getState().adaptive.calibration).toEqual(result);
    expect(useGameStore.getState().player.xp).toBe(beforeXp);
    expect(useGameStore.getState().skillEvidence).toHaveLength(beforeEvidence);
  });
});
