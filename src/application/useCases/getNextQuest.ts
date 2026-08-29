import type { CalibrationLevel, CalibrationResult } from '../../domain/calibration/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { Quest } from '../../domain/quest/types';
import type { SkillMasteryMap } from '../../domain/skill/types';

export interface SelectNextQuestInput {
  quests: Quest[];
  progress: ProgressMap;
  calibration?: CalibrationResult | null;
  /** Reserved for weak-skill priority; unused when empty. */
  mastery?: SkillMasteryMap;
}

function isCandidate(quest: Quest, progress: ProgressMap): boolean {
  const current = progress[quest.id];

  if (!current || current.status === 'cleared') {
    return false;
  }

  if (current.status === 'locked') {
    return false;
  }

  return quest.prerequisiteQuestIds.every((id) => progress[id]?.status === 'cleared');
}

function listCandidates(quests: Quest[], progress: ProgressMap): Quest[] {
  return quests.filter((quest) => isCandidate(quest, progress));
}

/**
 * Prefer a difficulty band by calibration level.
 * Always falls back to the full candidate list when the preferred band is empty (no deadlock).
 */
export function preferByDifficultyPath(
  candidates: Quest[],
  level: CalibrationLevel | undefined | null,
): Quest[] {
  if (!level || candidates.length === 0) {
    return candidates;
  }

  let preferred: Quest[];

  switch (level) {
    case 'beginner':
      preferred = candidates.filter((quest) => quest.difficulty <= 2);
      break;
    case 'intermediate':
      preferred = candidates.filter(
        (quest) => quest.difficulty >= 2 && quest.difficulty <= 4,
      );
      break;
    case 'advanced':
      // Skip low-difficulty filler when harder work is available.
      preferred = candidates.filter((quest) => quest.difficulty >= 3);
      break;
    default:
      preferred = candidates;
  }

  return preferred.length > 0 ? preferred : candidates;
}

/**
 * Deterministic next-quest selection for Adaptive Core.
 *
 * Priority:
 * 1. calibration.recommendedQuestId when still a candidate
 * 2. difficulty path preference by calibration.level
 * 3. first candidate in quests array order
 *
 * Review due / weak skill are reserved for later Steps.
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

  const ranked = preferByDifficultyPath(candidates, calibration?.level);
  return ranked[0] ?? null;
}

/**
 * Legacy helper: first selectable quest without calibration influence.
 */
export function getNextQuest(quests: Quest[], progress: ProgressMap): Quest | null {
  return selectNextQuest({ quests, progress, calibration: null });
}
