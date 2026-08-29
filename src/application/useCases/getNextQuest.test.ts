import { describe, expect, it } from 'vitest';
import type { CalibrationResult } from '../../domain/calibration/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { Quest } from '../../domain/quest/types';
import type { ReviewStateMap } from '../../domain/review/types';
import { quests } from '../../content/quests';
import {
  getNextQuest,
  preferByDifficultyPath,
  selectNextQuest,
} from './getNextQuest';

function buildProgress(overrides: Partial<ProgressMap> = {}): ProgressMap {
  const base: ProgressMap = Object.fromEntries(
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

  return { ...base, ...overrides } as ProgressMap;
}

function clear(questId: string): ProgressMap[string] {
  return {
    questId,
    status: 'cleared',
    attempts: 1,
    bestScore: 100,
    lastScore: 100,
    clearedAt: '2026-08-30T00:00:00.000Z',
  };
}

function available(questId: string): ProgressMap[string] {
  return {
    questId,
    status: 'available',
    attempts: 0,
    bestScore: 0,
    lastScore: null,
    clearedAt: null,
  };
}

describe('getNextQuest', () => {
  it('returns the first available quest when nothing is cleared', () => {
    const progress = buildProgress();
    expect(getNextQuest(quests, progress)?.id).toBe('promise-basics');
  });

  it('skips cleared quests and respects prerequisites', () => {
    const progress = buildProgress({
      'promise-basics': clear('promise-basics'),
      'promise-state': available('promise-state'),
      'promise-chain': available('promise-chain'),
    });

    expect(getNextQuest(quests, progress)?.id).toBe('promise-state');
  });

  it('returns null when every quest is cleared', () => {
    const progress = buildProgress(
      Object.fromEntries(quests.map((quest) => [quest.id, clear(quest.id)])) as ProgressMap,
    );
    expect(getNextQuest(quests, progress)).toBeNull();
  });
});

describe('preferByDifficultyPath', () => {
  const sample = [
    { id: 'a', difficulty: 1 },
    { id: 'b', difficulty: 2 },
    { id: 'c', difficulty: 3 },
  ] as Quest[];

  it('beginner prefers difficulty <= 2', () => {
    expect(preferByDifficultyPath(sample, 'beginner').map((q) => q.id)).toEqual(['a', 'b']);
  });

  it('intermediate prefers difficulty 2-4', () => {
    expect(preferByDifficultyPath(sample, 'intermediate').map((q) => q.id)).toEqual(['b', 'c']);
  });

  it('advanced prefers difficulty >= 3 and falls back when empty', () => {
    expect(preferByDifficultyPath(sample, 'advanced').map((q) => q.id)).toEqual(['c']);
    const onlyEasy = [{ id: 'a', difficulty: 1 }] as Quest[];
    expect(preferByDifficultyPath(onlyEasy, 'advanced').map((q) => q.id)).toEqual(['a']);
  });
});

describe('selectNextQuest', () => {
  it('matches getNextQuest when calibration is absent', () => {
    const progress = buildProgress();
    expect(selectNextQuest({ quests, progress })?.id).toBe(getNextQuest(quests, progress)?.id);
  });

  it('prefers calibration.recommendedQuestId when that quest is a candidate', () => {
    const progress = buildProgress({
      'promise-basics': clear('promise-basics'),
      'promise-state': available('promise-state'),
      'promise-chain': clear('promise-chain'),
      'event-loop': available('event-loop'),
    });

    const calibration: CalibrationResult = {
      calibrationId: 'async-world-calibration',
      level: 'intermediate',
      score: 80,
      recommendedQuestId: 'event-loop',
      completedAt: '2026-08-30T00:00:00.000Z',
    };

    expect(selectNextQuest({ quests, progress, calibration })?.id).toBe('event-loop');
  });

  it('falls back when recommended quest is locked or cleared', () => {
    const progress = buildProgress({
      'promise-basics': clear('promise-basics'),
      'promise-state': available('promise-state'),
      'promise-chain': available('promise-chain'),
    });

    const calibration: CalibrationResult = {
      calibrationId: 'async-world-calibration',
      level: 'intermediate',
      score: 80,
      recommendedQuestId: 'event-loop',
      completedAt: '2026-08-30T00:00:00.000Z',
    };

    expect(selectNextQuest({ quests, progress, calibration })?.id).toBe('promise-chain');
  });

  it('uses beginner difficulty path when recommendation is null', () => {
    const progress = buildProgress({
      'promise-basics': clear('promise-basics'),
      'promise-state': available('promise-state'),
      'promise-chain': available('promise-chain'),
    });

    const calibration: CalibrationResult = {
      calibrationId: 'async-world-calibration',
      level: 'beginner',
      score: 40,
      recommendedQuestId: null,
      completedAt: '2026-08-30T00:00:00.000Z',
    };

    expect(selectNextQuest({ quests, progress, calibration })?.id).toBe('promise-state');
  });

  it('advanced skips low difficulty when harder candidates exist', () => {
    const progress = buildProgress({
      'promise-basics': clear('promise-basics'),
      'promise-chain': clear('promise-chain'),
      'promise-state': available('promise-state'),
      'async-await-final': available('async-await-final'),
    });

    const calibration: CalibrationResult = {
      calibrationId: 'async-world-calibration',
      level: 'advanced',
      score: 100,
      recommendedQuestId: null,
      completedAt: '2026-08-30T00:00:00.000Z',
    };

    expect(selectNextQuest({ quests, progress, calibration })?.id).toBe('async-await-final');
  });

  it('falls back when recommendedQuestId is null and no level filter needed', () => {
    const progress = buildProgress();
    const calibration: CalibrationResult = {
      calibrationId: 'async-world-calibration',
      level: 'advanced',
      score: 100,
      recommendedQuestId: null,
      completedAt: '2026-08-30T00:00:00.000Z',
    };

    expect(selectNextQuest({ quests, progress, calibration })?.id).toBe('promise-basics');
  });

  it('does not select locked quests even if listed before available ones', () => {
    const progress = buildProgress();
    const ordered = [
      quests.find((q) => q.id === 'promise-chain')!,
      quests.find((q) => q.id === 'promise-basics')!,
    ] as Quest[];

    expect(selectNextQuest({ quests: ordered, progress })?.id).toBe('promise-basics');
  });

  it('prefers a cleared quest that covers a due knowledge node', () => {
    const progress = buildProgress({
      'promise-basics': clear('promise-basics'),
      'promise-state': available('promise-state'),
    });

    const review: ReviewStateMap = {
      promise: {
        knowledgeNodeId: 'promise',
        intervalIndex: 0,
        nextDueAt: '2026-08-01T00:00:00.000Z',
        lastReviewedAt: '2026-07-31T00:00:00.000Z',
      },
    };

    const next = selectNextQuest({
      quests,
      progress,
      review,
      now: '2026-08-30T00:00:00.000Z',
    });

    // promise-basics covers knowledge node "promise" and is cleared → review replay
    expect(next?.id).toBe('promise-basics');
  });
});
