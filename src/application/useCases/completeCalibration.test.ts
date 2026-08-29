import { describe, expect, it } from 'vitest';
import { asyncWorldCalibration } from '../../content/calibration/asyncWorld';
import { completeCalibration } from './completeCalibration';

describe('completeCalibration', () => {
  it('returns a persisted-ready CalibrationResult without touching progress', () => {
    const result = completeCalibration(
      asyncWorldCalibration,
      [
        { questId: 'promise-basics', score: 100, passed: true },
        { questId: 'event-loop', score: 80, passed: true },
        { questId: 'async-await-final', score: 40, passed: false },
      ],
      '2026-08-30T00:00:00.000Z',
    );

    expect(result).toEqual({
      calibrationId: 'async-world-calibration',
      level: 'intermediate',
      score: 220 / 3,
      recommendedQuestId: 'async-await-final',
      completedAt: '2026-08-30T00:00:00.000Z',
    });
  });

  it('maps all-pass to advanced with no recommendation', () => {
    const result = completeCalibration(asyncWorldCalibration, [
      { questId: 'promise-basics', score: 100, passed: true },
      { questId: 'event-loop', score: 100, passed: true },
      { questId: 'async-await-final', score: 100, passed: true },
    ]);

    expect(result.level).toBe('advanced');
    expect(result.recommendedQuestId).toBeNull();
  });
});
