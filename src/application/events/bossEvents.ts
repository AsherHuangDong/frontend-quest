export type BossPhaseChangedEvent = {
  type: 'BOSS_PHASE_CHANGED';
  bossId: string;
  bossName?: string;
  previousPhase: number;
  currentPhase: number;
};

export type BossClearedEvent = {
  type: 'BOSS_CLEARED';
  bossId: string;
  bossName?: string;
  rewards?: {
    xp?: number;
    items?: string[];
  };
};

export function createBossPhaseChangedEvent(input: {
  bossId: string;
  bossName?: string;
  previousPhase: number;
  currentPhase: number;
}): BossPhaseChangedEvent {
  return {
    type: 'BOSS_PHASE_CHANGED',
    ...input,
  };
}

export function createBossClearedEvent(input: {
  bossId: string;
  bossName?: string;
  rewards?: BossClearedEvent['rewards'];
}): BossClearedEvent {
  return {
    type: 'BOSS_CLEARED',
    ...input,
  };
}
