export const MAX_SCORE = 100;
export const HINT_PENALTIES = [20, 30] as const;

export function calculateScore(hintsUsed: number, passed: boolean): number {
  if (!passed) return 0;

  const penalty = HINT_PENALTIES.slice(0, hintsUsed).reduce(
    (total, value) => total + value,
    0,
  );

  return Math.max(0, MAX_SCORE - penalty);
}

export function getHintPenalty(hintIndex: number): number {
  return HINT_PENALTIES[hintIndex] ?? 0;
}
