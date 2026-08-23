const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700];

export function calculateLevel(xp: number): number {
  let level = 1;

  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold) level = LEVEL_THRESHOLDS.indexOf(threshold) + 1;
  }

  return level;
}
