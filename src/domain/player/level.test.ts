import { describe, expect, it } from 'vitest';
import { calculateLevel, getLevelProgress } from './level';

describe('calculateLevel', () => {
  it('starts at level 1', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('reaches level 2 at 100 xp', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('reaches higher levels at thresholds', () => {
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(700)).toBe(5);
  });
});

describe('getLevelProgress', () => {
  it('reports progress within a band', () => {
    const progress = getLevelProgress(50);
    expect(progress.level).toBe(1);
    expect(progress.nextLevelXp).toBe(100);
    expect(progress.xpToNext).toBe(50);
    expect(progress.progressPercent).toBe(50);
  });

  it('is full at max level band', () => {
    const progress = getLevelProgress(800);
    expect(progress.level).toBe(5);
    expect(progress.nextLevelXp).toBeNull();
    expect(progress.progressPercent).toBe(100);
  });
});
