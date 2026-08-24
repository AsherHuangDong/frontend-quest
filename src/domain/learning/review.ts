import type { SkillMastery } from './types';

const REVIEW_DAYS = [1, 3, 7, 14, 30];

export function scheduleNextReview(mastery: SkillMastery, now: Date): string {
  const score = mastery.scores.retention;
  const index = score >= 90 ? 4 : score >= 75 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
  const days = REVIEW_DAYS[index];
  const next = new Date(now);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

export function isReviewDue(mastery: SkillMastery, now: Date): boolean {
  return !!mastery.nextReviewAt && new Date(mastery.nextReviewAt).getTime() <= now.getTime();
}
