import { beforeEach, describe, expect, it } from 'vitest';
import type { GameSave } from './gameRepository';
import { LocalStorageGameRepository } from './localStorageGameRepository';

const STORAGE_KEY = 'frontend-quest:save';

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

describe('LocalStorageGameRepository', () => {
  beforeEach(() => {
    storage.clear();
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: storage,
    });
  });

  it('persists and restores learning state', () => {
    const repository = new LocalStorageGameRepository();
    const save = {
      version: 1 as const,
      player: { id: 'player-1', name: 'Frontend Knight', xp: 100 },
      progress: {},
      learning: {
        skillEvidence: [
          {
            id: 'evidence-1',
            questId: 'promise-basics',
            knowledgeNodeIds: ['promise'],
            skillDimension: 'understand' as const,
            score: 80,
            passed: true,
            createdAt: '2026-08-24T00:00:00.000Z',
          },
        ],
        skillMastery: {
          understand: {
            skillDimension: 'understand' as const,
            score: 80,
            evidenceCount: 1,
            updatedAt: '2026-08-24T00:00:00.000Z',
          },
        },
      },
      gameplay: { currentStreak: 1, bestStreak: 1 },
    } satisfies GameSave;

    repository.save(save);

    expect(repository.load()).toEqual(save);
  });

  it('persists and restores adaptive calibration state', () => {
    const repository = new LocalStorageGameRepository();
    const save: GameSave = {
      version: 1,
      player: { id: 'player-1', name: 'Frontend Knight', xp: 0 },
      progress: {},
      learning: { skillEvidence: [], skillMastery: {} },
      gameplay: { currentStreak: 0, bestStreak: 0 },
      adaptive: {
        calibration: {
          calibrationId: 'async-world-calibration',
          level: 'intermediate',
          score: 75,
          recommendedQuestId: 'async-await-final',
          completedAt: '2026-08-30T00:00:00.000Z',
        },
        review: {},
      },
    };

    repository.save(save);

    expect(repository.load()).toEqual(save);
  });

  it('removes the save', () => {
    const repository = new LocalStorageGameRepository();
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1 }));

    repository.clear();

    expect(repository.load()).toBeNull();
  });
});
