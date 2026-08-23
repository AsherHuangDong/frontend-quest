import type { Quest } from '../../domain/quest/types';
import type { EvaluationResult } from '../../domain/quest/types';
import { createQuestCompletedEvent } from '../events/questEvents';

export function createQuestFeedbackEvent(
  quest: Quest,
  evaluation: EvaluationResult,
  xp: number,
) {
  if (!evaluation.passed) {
    return null;
  }

  return createQuestCompletedEvent({
    questId: quest.id,
    questName: quest.title,
    rewards: {
      xp,
      skill: quest.skillDimensions,
    },
  });
}
