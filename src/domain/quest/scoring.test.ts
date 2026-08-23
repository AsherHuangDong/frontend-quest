import { describe, expect, it } from 'vitest';
import { calculateScore, getHintPenalty } from './scoring';

describe('quest scoring', () => {
  it('awards a perfect score without hints', () => {
    expect(calculateScore(0, true)).toBe(100);
  });

  it('deducts the first and second hint penalties', () => {
    expect(calculateScore(1, true)).toBe(80);
    expect(calculateScore(2, true)).toBe(50);
  });

  it('never gives a score to a failed submission', () => {
    expect(calculateScore(0, false)).toBe(0);
    expect(calculateScore(2, false)).toBe(0);
  });

  it('returns zero for unsupported hint indexes', () => {
    expect(getHintPenalty(2)).toBe(0);
  });
});
