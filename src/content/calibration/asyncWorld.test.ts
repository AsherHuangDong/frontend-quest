import { describe, expect, it } from 'vitest';
import { quests } from '../quests';
import { getCalibrationQuestIds } from '../../domain/calibration/types';
import { asyncWorldCalibration } from './asyncWorld';

describe('asyncWorldCalibration', () => {
  it('references existing quests only', () => {
    const ids = getCalibrationQuestIds(asyncWorldCalibration, quests);
    expect(ids).toEqual(asyncWorldCalibration.questIds);
    expect(ids).toHaveLength(3);
  });

  it('belongs to async-world', () => {
    expect(asyncWorldCalibration.worldId).toBe('async-world');
    expect(asyncWorldCalibration.id).toBe('async-world-calibration');
  });
});
