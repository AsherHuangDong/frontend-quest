import { describe, expect, it } from 'vitest';
import {
  applyQuestOutcomeToReview,
  isDue,
  listDueKnowledgeNodeIds,
  REVIEW_INTERVAL_DAYS,
  scheduleAfterFailure,
  scheduleInitial,
  scheduleNext,
} from './review';

const NOW = '2026-08-30T00:00:00.000Z';

describe('review schedule', () => {
  it('schedules initial review one day later', () => {
    const state = scheduleInitial('promise', NOW);
    expect(state.intervalIndex).toBe(0);
    expect(state.nextDueAt).toBe('2026-08-31T00:00:00.000Z');
    expect(state.lastReviewedAt).toBe(NOW);
  });

  it('advances through interval table and caps at 30 days', () => {
    let state = scheduleInitial('promise', NOW);
    // after initial, next success moves to index 1 (3 days)
    state = scheduleNext(state, '2026-08-31T00:00:00.000Z');
    expect(state.intervalIndex).toBe(1);
    expect(REVIEW_INTERVAL_DAYS[state.intervalIndex]).toBe(3);

    state = scheduleNext(state, state.nextDueAt);
    state = scheduleNext(state, state.nextDueAt);
    state = scheduleNext(state, state.nextDueAt);
    expect(state.intervalIndex).toBe(4);
    expect(REVIEW_INTERVAL_DAYS[state.intervalIndex]).toBe(30);

    const capped = scheduleNext(state, state.nextDueAt);
    expect(capped.intervalIndex).toBe(4);
  });

  it('detects due and not due', () => {
    const state = scheduleInitial('promise', NOW);
    expect(isDue(state, NOW)).toBe(false);
    expect(isDue(state, '2026-08-31T00:00:00.000Z')).toBe(true);
  });

  it('resets interval after failure', () => {
    const failed = scheduleAfterFailure('promise', NOW);
    expect(failed.intervalIndex).toBe(0);
    expect(failed.nextDueAt).toBe('2026-08-31T00:00:00.000Z');
  });
});

describe('applyQuestOutcomeToReview', () => {
  it('creates initial state on first pass', () => {
    const next = applyQuestOutcomeToReview({}, ['promise'], true, NOW);
    expect(next.promise?.intervalIndex).toBe(0);
    expect(next.promise?.nextDueAt).toBe('2026-08-31T00:00:00.000Z');
  });

  it('does not create state on first fail', () => {
    expect(applyQuestOutcomeToReview({}, ['promise'], false, NOW)).toEqual({});
  });

  it('advances only when due', () => {
    const initial = applyQuestOutcomeToReview({}, ['promise'], true, NOW);
    const notDueYet = applyQuestOutcomeToReview(initial, ['promise'], true, NOW);
    expect(notDueYet.promise?.intervalIndex).toBe(0);

    const due = applyQuestOutcomeToReview(
      initial,
      ['promise'],
      true,
      '2026-08-31T00:00:00.000Z',
    );
    expect(due.promise?.intervalIndex).toBe(1);
  });

  it('lists due knowledge nodes', () => {
    const review = applyQuestOutcomeToReview({}, ['promise', 'microtask'], true, NOW);
    expect(listDueKnowledgeNodeIds(review, NOW)).toEqual([]);
    expect(listDueKnowledgeNodeIds(review, '2026-08-31T00:00:00.000Z').sort()).toEqual([
      'microtask',
      'promise',
    ]);
  });
});
