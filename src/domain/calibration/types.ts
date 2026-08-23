import type { Quest } from '../quest/types';

export type CalibrationLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CalibrationDefinition {
  id: string;
  worldId: string;
  questIds: string[];
}

export interface CalibrationAnswer {
  questId: string;
  score: number;
  passed: boolean;
}

export interface CalibrationAttempt {
  id: string;
  calibrationId: string;
  answers: CalibrationAnswer[];
  completedAt: string;
}

export interface CalibrationResult {
  calibrationId: string;
  level: CalibrationLevel;
  score: number;
  recommendedQuestId: string | null;
  completedAt: string;
}

export function getCalibrationQuestIds(
  definition: CalibrationDefinition,
  quests: Quest[],
): string[] {
  const availableQuestIds = new Set(quests.map((quest) => quest.id));

  return definition.questIds.filter((questId) => availableQuestIds.has(questId));
}
