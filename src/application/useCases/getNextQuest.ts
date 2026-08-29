import type { CalibrationResult } from '../../domain/calibration/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { Quest } from '../../domain/quest/types';
import type { SkillMasteryMap } from '../../domain/skill/types';

export interface SelectNextQuestInput {
  quests: Quest[];
  progress: ProgressMap;
  calibration?: CalibrationResult | null;
  /** Reserved for Step 3+/4 weak-skill priority; unused when empty. */
  mastery?: SkillMasteryMap;
}

function isCandidate(quest: Quest, progress: ProgressMap): boolean {
  const current = progress[quest.id];

  if (!current || current.status === 'cleared') {
    return false;
  }

  // Locked quests are not selectable; available (or equivalent) must also satisfy prereqs.
  if (current.status === 'locked') {
    return false;
  }

  return quest.prerequisiteQuestIds.every((id) => progress[id]?.status === 'cleared');
}

function listCandidates(quests: Quest[], progress: ProgressMap): Quest[] {
  return quests.filter((quest) => isCandidate(quest, progress));
}

/**
 * Deterministic next-quest selection for Adaptive Core.
 *
 * Priority (MVP Step 3):
 * 1. calibration.recommendedQuestId when still a candidate
 * 2. first candidate in quests array order (legacy getNextQuest behavior)
 *
 * Review due / difficulty path / weak skill are reserved for later Steps.
 */
export function selectNextQuest(input: SelectNextQuestInput): Quest | null {
  const { quests, progress, calibration = null } = input;
  const candidates = listCandidates(quests, progress);

  if (candidates.length === 0) {
    return null;
  }

  const recommendedId = calibration?.recommendedQuestId;
  if (recommendedId) {
    const recommended = candidates.find((quest) => quest.id === recommendedId);
    if (recommended) {
      return recommended;
    }
  }

  return candidates[0] ?? null;
}

/**
 * Legacy helper: first non-cleared quest with cleared prerequisites.
 * Equivalent to selectNextQuest without calibration.
 */
export function getNextQuest(quests: Quest[], progress: ProgressMap): Quest | null {
  return selectNextQuest({ quests, progress, calibration: null });
}
