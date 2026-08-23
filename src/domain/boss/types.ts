export type BossPhaseStatus = 'LOCKED' | 'ACTIVE' | 'CLEARED';

export interface BossPhase {
  id: string;
  title: string;
  questIds: string[];
  requiredScore: number;
}

export interface BossDefinition {
  id: string;
  title: string;
  description: string;
  chapterId: string;
  phases: BossPhase[];
  rewardXp: number;
}

export interface BossProgress {
  bossId: string;
  currentPhaseIndex: number;
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'CLEARED';
  phaseScores: Record<string, number>;
}
