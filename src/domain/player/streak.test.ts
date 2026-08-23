import { describe, expect, it } from 'vitest';
import { advanceStreak, resetStreak } from './streak';

describe('streak rules', () => {
  it('increases streak and grants a capped bonus', () => {
    expect(advanceStreak(2, 3, true)).toEqual({
      current: 3,
      best: 3,
      bonusXp: 20,
    });

    expect(advanceStreak(4, 4, true)).toEqual({
      current: 5,
      best: 5,
      bonusXp: 40,
    });
  });

  it('does not change streak when replaying a cleared quest', () => {
    expect(advanceStreak(3, 5, false)).toEqual({
      current: 3,
      best: 5,
      bonusXp: 0,
    });
  });

  it('resets current streak after a failed challenge', () => {
    expect(resetStreak(5)).toEqual({
      current: 0,
      best: 5,
      bonusXp: 0,
    });
  });
});
