import type { EvaluationResult, Quest } from './types';

export interface RewardResult {
  xp: number;
  streak: number;
}

export function calculateReward(
  quest: Quest,
  evaluation: EvaluationResult,
  currentStreak: number,
  alreadyCleared: boolean,
): RewardResult {
  if (!evaluation.passed || alreadyCleared) {
    return { xp: 0, streak: evaluation.passed ? currentStreak : 0 };
  }

  const nextStreak = currentStreak + 1;
  const streakBonus = Math.min(nextStreak - 1, 4) * 10;

  return {
    xp: quest.reward.xp + streakBonus,
    streak: nextStreak,
  };
}
