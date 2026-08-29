import type { Player } from '../../domain/player/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { BossProgress } from '../../domain/boss/types';
import type { SkillEvidence, SkillMasteryMap } from '../../domain/skill/types';
import type { CalibrationResult } from '../../domain/calibration/types';
import type { ReviewStateMap } from '../../domain/review/types';

export type { ReviewStateMap };

export interface AdaptiveSaveState {
  calibration: CalibrationResult | null;
  review: ReviewStateMap;
  /** ISO timestamp of last meaningful activity (for return experience). */
  lastActiveAt?: string | null;
}

export interface GameSave {
  version: 1;
  player: Player;
  progress: ProgressMap;
  learning: {
    skillEvidence: SkillEvidence[];
    skillMastery: SkillMasteryMap;
  };
  gameplay: {
    currentStreak: number;
    bestStreak: number;
    bossProgress?: BossProgress;
  };
  /** Optional for legacy saves; loaders must default when missing. */
  adaptive?: AdaptiveSaveState;
}

export function createDefaultAdaptiveState(): AdaptiveSaveState {
  return {
    calibration: null,
    review: {},
    lastActiveAt: null,
  };
}

export function normalizeAdaptiveState(
  adaptive: AdaptiveSaveState | undefined | null,
): AdaptiveSaveState {
  if (!adaptive) {
    return createDefaultAdaptiveState();
  }

  return {
    calibration: adaptive.calibration ?? null,
    review: adaptive.review ?? {},
    lastActiveAt: adaptive.lastActiveAt ?? null,
  };
}

export function touchAdaptiveActivity(
  adaptive: AdaptiveSaveState,
  now: string = new Date().toISOString(),
): AdaptiveSaveState {
  return {
    ...adaptive,
    lastActiveAt: now,
  };
}

export interface GameRepository {
  load(): GameSave | null;
  save(save: GameSave): void;
  clear(): void;
}
