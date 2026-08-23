import type {
  CalibrationAnswer,
  CalibrationDefinition,
  CalibrationLevel,
  CalibrationResult,
} from './types';

export function calculateCalibrationScore(answers: CalibrationAnswer[]): number {
  if (answers.length === 0) {
    return 0;
  }

  return answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length;
}

export function calculateCalibrationLevel(
  answers: CalibrationAnswer[],
  questIds: string[],
): CalibrationLevel {
  let highestCompletedIndex = -1;

  for (let index = 0; index < questIds.length; index += 1) {
    const answer = answers.find((item) => item.questId === questIds[index]);

    if (!answer?.passed) {
      break;
    }

    highestCompletedIndex = index;
  }

  if (highestCompletedIndex >= 2) {
    return 'advanced';
  }

  if (highestCompletedIndex >= 1) {
    return 'intermediate';
  }

  return 'beginner';
}

export function calculateCalibrationResult(
  definition: CalibrationDefinition,
  answers: CalibrationAnswer[],
  completedAt = new Date().toISOString(),
): CalibrationResult {
  const score = calculateCalibrationScore(answers);
  const level = calculateCalibrationLevel(answers, definition.questIds);
  const completedCount = definition.questIds.findIndex(
    (questId) => !answers.find((answer) => answer.questId === questId)?.passed,
  );
  const lastPassedIndex = completedCount === -1 ? definition.questIds.length - 1 : completedCount - 1;

  return {
    calibrationId: definition.id,
    level,
    score,
    recommendedQuestId: definition.questIds[lastPassedIndex + 1] ?? null,
    completedAt,
  };
}
