import type { CalibrationLevel, CalibrationResult } from '../../domain/calibration/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { Quest } from '../../domain/quest/types';
import type { ReviewStateMap } from '../../domain/review/types';
import { listDueKnowledgeNodeIds } from '../../domain/review/review';
import type { SkillMasteryMap } from '../../domain/skill/types';

export interface SelectNextQuestInput {
  quests: Quest[];
  progress: ProgressMap;
  calibration?: CalibrationResult | null;
  mastery?: SkillMasteryMap;
  review?: ReviewStateMap;
  now?: string;
}

function prereqsCleared(quest: Quest, progress: ProgressMap): boolean {
  return quest.prerequisiteQuestIds.every((id) => progress[id]?.status === 'cleared');
}

function isLearningCandidate(quest: Quest, progress: ProgressMap): boolean {
  const current = progress[quest.id];

  if (!current || current.status === 'cleared' || current.status === 'locked') {
    return false;
  }

  return prereqsCleared(quest, progress);
}

function listLearningCandidates(quests: Quest[], progress: ProgressMap): Quest[] {
  return quests.filter((quest) => isLearningCandidate(quest, progress));
}

/** Cleared or available quests that cover at least one due knowledge node. */
function listReviewCandidates(
  quests: Quest[],
  progress: ProgressMap,
  dueNodeIds: Set<string>,
): Quest[] {
  if (dueNodeIds.size === 0) {
    return [];
  }

  return quests.filter((quest) => {
    const current = progress[quest.id];
    if (!current || current.status === 'locked') {
      return false;
    }
    if (!prereqsCleared(quest, progress) && current.status !== 'cleared') {
      return false;
    }
    return quest.knowledgeNodeIds.some((id) => dueNodeIds.has(id));
  });
}

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
      preferred = candidates.filter((quest) => quest.difficulty >= 3);
      break;
    default:
      preferred = candidates;
  }

  return preferred.length > 0 ? preferred : candidates;
}

/**
 * Priority:
 * 1. Quest covering a due knowledge-node review (may be cleared replay)
 * 2. calibration.recommendedQuestId
 * 3. difficulty path
 * 4. first learning candidate
 */
export function selectNextQuest(input: SelectNextQuestInput): Quest | null {
  const {
    quests,
    progress,
    calibration = null,
    review = {},
    now = new Date().toISOString(),
  } = input;

  const dueIds = new Set(listDueKnowledgeNodeIds(review, now));
  const reviewCandidates = listReviewCandidates(quests, progress, dueIds);
  if (reviewCandidates.length > 0) {
    return reviewCandidates[0] ?? null;
  }

  const candidates = listLearningCandidates(quests, progress);
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

export function getNextQuest(quests: Quest[], progress: ProgressMap): Quest | null {
  return selectNextQuest({ quests, progress, calibration: null, review: {} });
}
