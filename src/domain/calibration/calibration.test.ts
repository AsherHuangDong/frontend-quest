import { describe, expect, it } from 'vitest';
import type { CalibrationAnswer, CalibrationDefinition } from './types';
import {
  calculateCalibrationLevel,
  calculateCalibrationResult,
  calculateCalibrationScore,
} from './calibration';

const definition: CalibrationDefinition = {
  id: 'async-world-calibration',
  worldId: 'async-world',
  questIds: ['quest-1', 'quest-2', 'quest-3'],
};

const answers: CalibrationAnswer[] = [
  { questId: 'quest-1', score: 100, passed: true },
  { questId: 'quest-2', score: 80, passed: true },
  { questId: 'quest-3', score: 40, passed: false },
];

describe('calibration', () => {
  it('calculates the average calibration score', () => {
    expect(calculateCalibrationScore(answers)).toBeCloseTo(73.33, 2);
  });

  it('uses the highest continuous passed quest to determine the level', () => {
    expect(calculateCalibrationLevel(answers, definition.questIds)).toBe('intermediate');
    expect(
      calculateCalibrationLevel(
        [
          { questId: 'quest-1', score: 100, passed: true },
          { questId: 'quest-2', score: 80, passed: false },
          { questId: 'quest-3', score: 100, passed: true },
        ],
        definition.questIds,
      ),
    ).toBe('beginner');
  });

  it('recommends the first failed or next quest after continuous passes', () => {
    expect(calculateCalibrationResult(definition, answers, '2026-08-23T12:00:00.000Z')).toEqual({
      calibrationId: 'async-world-calibration',
      level: 'intermediate',
      score: 220 / 3,
      recommendedQuestId: 'quest-3',
      completedAt: '2026-08-23T12:00:00.000Z',
    });
  });

  it('returns no recommendation after completing all calibration quests', () => {
    expect(
      calculateCalibrationResult(
        definition,
        [
          { questId: 'quest-1', score: 100, passed: true },
          { questId: 'quest-2', score: 90, passed: true },
          { questId: 'quest-3', score: 80, passed: true },
        ],
      ).recommendedQuestId,
    ).toBeNull();
  });

  it('returns beginner and the first quest when the first answer fails', () => {
    expect(
      calculateCalibrationResult(definition, [
        { questId: 'quest-1', score: 20, passed: false },
      ]).level,
    ).toBe('beginner');

    expect(
      calculateCalibrationResult(definition, [
        { questId: 'quest-1', score: 20, passed: false },
      ]).recommendedQuestId,
    ).toBe('quest-1');
  });
});
