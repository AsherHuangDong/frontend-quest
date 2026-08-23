import type { BossDefinition, BossProgress, BossPhaseStatus } from './types';

export function getPhaseStatus(
  boss: BossDefinition,
  progress: BossProgress,
  phaseIndex: number,
): BossPhaseStatus {
  if (phaseIndex < 0 || phaseIndex >= boss.phases.length) return 'LOCKED';
  if (phaseIndex < progress.currentPhaseIndex) return 'CLEARED';
  if (phaseIndex === progress.currentPhaseIndex && progress.status !== 'CLEARED') return 'ACTIVE';
  return 'LOCKED';
}

export function createBossProgress(bossId: string): BossProgress {
  return {
    bossId,
    currentPhaseIndex: 0,
    status: 'AVAILABLE',
    phaseScores: {},
  };
}

export function startBoss(progress: BossProgress): BossProgress {
  if (progress.status !== 'AVAILABLE') return progress;
  return { ...progress, status: 'IN_PROGRESS' };
}

export function completePhase(
  boss: BossDefinition,
  progress: BossProgress,
  score: number,
): BossProgress {
  const phase = boss.phases[progress.currentPhaseIndex];
  if (!phase || score < phase.requiredScore) return progress;

  const phaseScores = { ...progress.phaseScores, [phase.id]: score };
  const isFinalPhase = progress.currentPhaseIndex === boss.phases.length - 1;

  if (isFinalPhase) {
    return { ...progress, status: 'CLEARED', phaseScores };
  }

  return {
    ...progress,
    currentPhaseIndex: progress.currentPhaseIndex + 1,
    status: 'IN_PROGRESS',
    phaseScores,
  };
}
