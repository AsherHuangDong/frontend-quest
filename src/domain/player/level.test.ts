import { describe, expect, it } from 'vitest';
import { calculateLevel } from './level';

describe('calculateLevel', () => {
  it('starts at level 1 with zero xp', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('levels up at each configured threshold', () => {
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(249)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(449)).toBe(3);
    expect(calculateLevel(450)).toBe(4);
    expect(calculateLevel(700)).toBe(5);
  });

  it('does not mutate or persist player state', () => {
    expect(calculateLevel(120)).toBe(2);
  });
});
