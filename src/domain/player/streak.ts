export interface StreakResult {
  current: number;
  best: number;
  bonusXp: number;
}

export function advanceStreak(
  current: number,
  best: number,
  clearedForFirstTime: boolean,
): StreakResult {
  if (!clearedForFirstTime) {
    return { current, best, bonusXp: 0 };
  }

  const next = current + 1;

  return {
    current: next,
    best: Math.max(best, next),
    bonusXp: Math.min(next - 1, 4) * 10,
  };
}

export function resetStreak(best: number): StreakResult {
  return {
    current: 0,
    best,
    bonusXp: 0,
  };
}
