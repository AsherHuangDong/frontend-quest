import { describe, expect, it } from 'vitest';
import type { ProgressMap } from '../domain/progress/types';
import { quests } from '../content/quests';
import { mergeQuestProgress } from './progressMigration';

function createSavedProgress(): ProgressMap {
  return {
    'promise-basics': {
      questId: 'promise-basics',
      status: 'cleared',
      attempts: 1,
      bestScore: 100,
      lastScore: 100,
      clearedAt: '2026-08-23T00:00:00.000Z',
    },
    'promise-chain': {
      questId: 'promise-chain',
      status: 'cleared',
      attempts: 1,
      bestScore: 100,
      lastScore: 100,
      clearedAt: '2026-08-23T00:01:00.000Z',
    },
  };
}

describe('mergeQuestProgress', () => {
  it('unlocks a newly added quest when its saved prerequisites are already cleared', () => {
    const merged = mergeQuestProgress(createSavedProgress(), quests);

    expect(merged['promise-basics'].status).toBe('cleared');
    expect(merged['promise-chain'].status).toBe('cleared');
    expect(merged['async-await-final'].status).toBe('available');
  });

  it('keeps a newly added quest locked when prerequisites are not cleared', () => {
    const saved = createSavedProgress();
    saved['promise-chain'] = { ...saved['promise-chain'], status: 'available' };

    const merged = mergeQuestProgress(saved, quests);

    expect(merged['async-await-final'].status).toBe('locked');
  });
});
