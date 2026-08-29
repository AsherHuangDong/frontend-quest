import { calculateCalibrationResult } from '../../domain/calibration/calibration';
import type {
  CalibrationAnswer,
  CalibrationDefinition,
  CalibrationResult,
} from '../../domain/calibration/types';

/**
 * Completes a calibration attempt.
 * Does not produce SkillEvidence and does not mutate QuestProgress / XP.
 */
export function completeCalibration(
  definition: CalibrationDefinition,
  answers: CalibrationAnswer[],
  completedAt = new Date().toISOString(),
): CalibrationResult {
  return calculateCalibrationResult(definition, answers, completedAt);
}
