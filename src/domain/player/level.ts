const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700];

export function calculateLevel(xp: number): number {
  let level = 1;

  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold) level = LEVEL_THRESHOLDS.indexOf(threshold) + 1;
  }

  return level;
}

export interface LevelProgress {
  level: number;
  xp: number;
  /** XP required to reach current level (floor). */
  currentLevelXp: number;
  /** XP required for next level; null if max. */
  nextLevelXp: number | null;
  /** 0–100 within current band. */
  progressPercent: number;
  xpIntoLevel: number;
  xpToNext: number | null;
}

export function getLevelProgress(xp: number): LevelProgress {
  const level = calculateLevel(xp);
  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextLevelXp =
    level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : null;

  if (nextLevelXp === null) {
    return {
      level,
      xp,
      currentLevelXp,
      nextLevelXp: null,
      progressPercent: 100,
      xpIntoLevel: Math.max(0, xp - currentLevelXp),
      xpToNext: null,
    };
  }

  const span = nextLevelXp - currentLevelXp;
  const xpIntoLevel = Math.max(0, xp - currentLevelXp);
  const progressPercent =
    span <= 0 ? 100 : Math.min(100, Math.round((xpIntoLevel / span) * 100));

  return {
    level,
    xp,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
    xpIntoLevel,
    xpToNext: Math.max(0, nextLevelXp - xp),
  };
}
