import type { Player } from '../../domain/player/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { BossProgress } from '../../domain/boss/types';
import type { SkillEvidence, SkillMasteryMap } from '../../domain/skill/types';
import type { CalibrationResult } from '../../domain/calibration/types';

/** Knowledge-node spaced review state (shape reserved for Step 5). */
export type ReviewStateMap = Record<
  string,
  {
    knowledgeNodeId: string;
    intervalIndex: number;
    nextDueAt: string;
    lastReviewedAt: string | null;
  }
>;

export interface AdaptiveSaveState {
  calibration: CalibrationResult | null;
  review: ReviewStateMap;
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
  };
}

export interface GameRepository {
  load(): GameSave | null;
  save(save: GameSave): void;
  clear(): void;
}
