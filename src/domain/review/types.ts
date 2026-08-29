/** Index into REVIEW_INTERVAL_DAYS: 1, 3, 7, 14, 30 */
export type ReviewIntervalIndex = 0 | 1 | 2 | 3 | 4;

export interface KnowledgeReviewState {
  knowledgeNodeId: string;
  intervalIndex: ReviewIntervalIndex;
  nextDueAt: string;
  lastReviewedAt: string | null;
}

export type ReviewStateMap = Record<string, KnowledgeReviewState>;
