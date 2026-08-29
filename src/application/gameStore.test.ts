import { beforeEach, describe, expect, it, vi } from 'vitest';
import { selectNextQuest } from './useCases/getNextQuest';
import { quests } from '../content/quests';

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
    expect(state.adaptive).toEqual({ calibration: null, review: {} });
  });
});

describe('gameStore quest experience flow', () => {
  beforeEach(() => {
    storage.clear();
    installStorage();
  });

  it('does not start a locked quest', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-chain');

    expect(useGameStore.getState().runtime).toBeNull();
  });

  it('starts an available quest with an empty runtime', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');

    expect(useGameStore.getState().runtime).toEqual({
      questId: 'promise-basics',
      selectedAnswer: null,
      result: null,
    });
  });

  it('does not submit before an answer is selected', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().submitAnswer();

    expect(useGameStore.getState().runtime?.result).toBeNull();
  });

  it('does not change the selected answer after a result exists', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    const runtimeAfterSubmit = useGameStore.getState().runtime;
    useGameStore.getState().selectAnswer('A');

    expect(useGameStore.getState().runtime).toEqual(runtimeAfterSubmit);
  });

  it('retry clears the answer and result while keeping the quest active', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();
    useGameStore.getState().retryQuest();

    expect(useGameStore.getState().runtime).toEqual({
      questId: 'promise-basics',
      selectedAnswer: null,
      result: null,
    });
  });

  it('exit clears the active quest runtime', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().exitQuest();

    expect(useGameStore.getState().runtime).toBeNull();
  });
});

describe('gameStore adaptive calibration', () => {
  beforeEach(() => {
    storage.clear();
    installStorage();
  });

  it('finishCalibration persists result and does not add skill evidence or xp', async () => {
    const { useGameStore } = await loadStore();
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

  it('reloads calibration from storage after module reset', async () => {
    let storeModule = await loadStore();

    storeModule.useGameStore.getState().finishCalibration(
      [
        { questId: 'promise-basics', score: 100, passed: true },
        { questId: 'event-loop', score: 100, passed: true },
        { questId: 'async-await-final', score: 100, passed: true },
      ],
      '2026-08-30T12:00:00.000Z',
    );

    vi.resetModules();
    storeModule = await import('./gameStore');

    expect(storeModule.useGameStore.getState().adaptive.calibration?.level).toBe('advanced');
    expect(storeModule.useGameStore.getState().adaptive.calibration?.recommendedQuestId).toBeNull();
  });
});

describe('gameStore adaptive review integration', () => {
  beforeEach(() => {
    storage.clear();
    installStorage();
  });

  it('schedules knowledge-node review after a successful quest', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    const review = useGameStore.getState().adaptive.review.promise;
    expect(review).toBeDefined();
    expect(review?.knowledgeNodeId).toBe('promise');
    expect(review?.intervalIndex).toBe(0);
    expect(review?.lastReviewedAt).toBeTruthy();
    expect(review?.nextDueAt).toBeTruthy();
  });

  it('allows starting a cleared quest for review replay', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();
    useGameStore.getState().exitQuest();

    useGameStore.getState().startQuest('promise-basics');
    expect(useGameStore.getState().runtime?.questId).toBe('promise-basics');
  });

  it('persists review state across store reload', async () => {
    let storeModule = await loadStore();

    storeModule.useGameStore.getState().startQuest('promise-basics');
    storeModule.useGameStore.getState().selectAnswer('B');
    storeModule.useGameStore.getState().submitAnswer();

    const dueAt = storeModule.useGameStore.getState().adaptive.review.promise?.nextDueAt;
    expect(dueAt).toBeTruthy();

    vi.resetModules();
    storeModule = await import('./gameStore');

    expect(storeModule.useGameStore.getState().adaptive.review.promise?.nextDueAt).toBe(dueAt);
  });

  it('selectNextQuest uses store calibration and review together', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().finishCalibration(
      [
        { questId: 'promise-basics', score: 100, passed: true },
        { questId: 'event-loop', score: 100, passed: true },
        { questId: 'async-await-final', score: 40, passed: false },
      ],
      '2026-08-30T00:00:00.000Z',
    );

    useGameStore.getState().startQuest('promise-basics');
    useGameStore.getState().selectAnswer('B');
    useGameStore.getState().submitAnswer();

    const state = useGameStore.getState();
    const next = selectNextQuest({
      quests,
      progress: state.progress,
      calibration: state.adaptive.calibration,
      review: state.adaptive.review,
    });

    // Without due review yet, recommendation or difficulty path applies.
    expect(next).not.toBeNull();
    expect(state.adaptive.calibration?.recommendedQuestId).toBe('async-await-final');
  });
});
