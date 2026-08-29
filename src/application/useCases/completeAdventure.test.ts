import { describe, it, expect } from 'vitest';
import { chapter1 } from '../../content/adventures/chapter1';
import { completeAdventure, CHAPTER1_REWARD_XP } from './completeAdventure';

const basePlayer = { id: 'p1', name: 'Apprentice', xp: 0 };

describe('completeAdventure', () => {
  it('clears chapter, awards XP, and records evidence on first success', () => {
    const result = completeAdventure({
      chapter: chapter1,
      player: basePlayer,
      progress: {},
      skillEvidence: [],
      currentStreak: 0,
      bestStreak: 0,
      review: {},
      now: '2026-08-30T00:00:00.000Z',
    });

    expect(result.alreadyCleared).toBe(false);
    expect(result.progress[chapter1.id]?.status).toBe('cleared');
    expect(result.progress[chapter1.id]?.clearedAt).toBe('2026-08-30T00:00:00.000Z');
    expect(result.awardedXp).toBeGreaterThanOrEqual(CHAPTER1_REWARD_XP);
    expect(result.player.xp).toBe(result.awardedXp);
    expect(result.newEvidence.length).toBe(2);
    expect(result.skillMastery.understand?.evidenceCount).toBe(1);
    expect(result.skillMastery.apply?.evidenceCount).toBe(1);
    expect(result.review.promise).toBeDefined();
  });

  it('does not re-award XP on replay clear', () => {
    const first = completeAdventure({
      chapter: chapter1,
      player: basePlayer,
      progress: {},
      skillEvidence: [],
      currentStreak: 0,
      bestStreak: 0,
      review: {},
      now: '2026-08-30T00:00:00.000Z',
    });

    const second = completeAdventure({
      chapter: chapter1,
      player: first.player,
      progress: first.progress,
      skillEvidence: first.skillEvidence,
      currentStreak: first.currentStreak,
      bestStreak: first.bestStreak,
      review: first.review,
      now: '2026-08-30T01:00:00.000Z',
    });

    expect(second.alreadyCleared).toBe(true);
    expect(second.awardedXp).toBe(0);
    expect(second.player.xp).toBe(first.player.xp);
    expect(second.progress[chapter1.id]?.attempts).toBe(2);
    expect(second.newEvidence.length).toBe(2);
  });
});
