import { describe, expect, it } from 'vitest';
import { buildHubStatusBanner, hoursAway } from './returnCopy';
import type { ReviewStateMap } from '../../domain/review/types';

const NOW = '2026-08-30T12:00:00.000Z';

describe('returnCopy', () => {
  it('ignores short absences', () => {
    expect(hoursAway('2026-08-30T08:00:00.000Z', NOW)).toBeNull();
  });

  it('detects multi-day return', () => {
    expect(hoursAway('2026-08-28T12:00:00.000Z', NOW)).toBeGreaterThanOrEqual(24);
  });

  it('prefers return+review messaging when both apply', () => {
    const review: ReviewStateMap = {
      promise: {
        knowledgeNodeId: 'promise',
        intervalIndex: 0,
        nextDueAt: '2026-08-29T00:00:00.000Z',
        lastReviewedAt: '2026-08-28T00:00:00.000Z',
      },
    };

    const banner = buildHubStatusBanner({
      lastActiveAt: '2026-08-28T12:00:00.000Z',
      review,
      now: NOW,
    });

    expect(banner?.tone).toBe('return');
    expect(banner?.title).toBe('欢迎回来');
    expect(banner?.body).toMatch(/加固|复习/);
  });

  it('shows review-only when still active', () => {
    const review: ReviewStateMap = {
      promise: {
        knowledgeNodeId: 'promise',
        intervalIndex: 0,
        nextDueAt: '2026-08-29T00:00:00.000Z',
        lastReviewedAt: '2026-08-28T00:00:00.000Z',
      },
    };

    const banner = buildHubStatusBanner({
      lastActiveAt: '2026-08-30T10:00:00.000Z',
      review,
      now: NOW,
    });

    expect(banner?.tone).toBe('review');
    expect(banner?.title).toMatch(/复习/);
  });
});
