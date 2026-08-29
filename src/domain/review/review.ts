import type {
  KnowledgeReviewState,
  ReviewIntervalIndex,
  ReviewStateMap,
} from './types';

/** Days between successful reviews (PROJECT_SPEC MVP table). */
export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;

export function clampIntervalIndex(index: number): ReviewIntervalIndex {
  if (index <= 0) return 0;
  if (index >= 4) return 4;
  return index as ReviewIntervalIndex;
}

export function addDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export function isDue(
  state: KnowledgeReviewState,
  now: string = new Date().toISOString(),
): boolean {
  return new Date(now).getTime() >= new Date(state.nextDueAt).getTime();
}

/** After a successful review: advance interval (cap at 30 days). */
export function scheduleNext(
  state: KnowledgeReviewState,
  now: string = new Date().toISOString(),
): KnowledgeReviewState {
  const nextIndex = clampIntervalIndex(state.intervalIndex + 1);
  const days = REVIEW_INTERVAL_DAYS[nextIndex];

  return {
    knowledgeNodeId: state.knowledgeNodeId,
    intervalIndex: nextIndex,
    nextDueAt: addDays(now, days),
    lastReviewedAt: now,
  };
}

/** First schedule after initial mastery (interval 0 → due in 1 day). */
export function scheduleInitial(
  knowledgeNodeId: string,
  now: string = new Date().toISOString(),
): KnowledgeReviewState {
  return {
    knowledgeNodeId,
    intervalIndex: 0,
    nextDueAt: addDays(now, REVIEW_INTERVAL_DAYS[0]),
    lastReviewedAt: now,
  };
}

/** Failed due review: reset to shortest interval. */
export function scheduleAfterFailure(
  knowledgeNodeId: string,
  now: string = new Date().toISOString(),
): KnowledgeReviewState {
  return {
    knowledgeNodeId,
    intervalIndex: 0,
    nextDueAt: addDays(now, REVIEW_INTERVAL_DAYS[0]),
    lastReviewedAt: now,
  };
}

export function listDueKnowledgeNodeIds(
  review: ReviewStateMap,
  now: string = new Date().toISOString(),
): string[] {
  return Object.values(review)
    .filter((state) => isDue(state, now))
    .map((state) => state.knowledgeNodeId);
}

/**
 * Apply a quest outcome to knowledge-node review state.
 * - First pass on a node: scheduleInitial
 * - Pass while due: scheduleNext
 * - Fail while due: scheduleAfterFailure
 * - Otherwise: unchanged
 */
export function applyQuestOutcomeToReview(
  review: ReviewStateMap,
  knowledgeNodeIds: string[],
  passed: boolean,
  now: string = new Date().toISOString(),
): ReviewStateMap {
  if (knowledgeNodeIds.length === 0) {
    return review;
  }

  const next: ReviewStateMap = { ...review };

  for (const knowledgeNodeId of knowledgeNodeIds) {
    const current = next[knowledgeNodeId];

    if (!current) {
      if (passed) {
        next[knowledgeNodeId] = scheduleInitial(knowledgeNodeId, now);
      }
      continue;
    }

    if (!isDue(current, now)) {
      continue;
    }

    next[knowledgeNodeId] = passed
      ? scheduleNext(current, now)
      : scheduleAfterFailure(knowledgeNodeId, now);
  }

  return next;
}
