import { describe, expect, it } from 'vitest';
import { asyncBoss } from '../../content/bosses/asyncBoss';
import {
  completePhase,
  createBossProgress,
  getPhaseStatus,
  startBoss,
} from './stateMachine';

describe('boss state machine', () => {
  it('starts with the first phase active', () => {
    const progress = createBossProgress(asyncBoss.id);
    expect(getPhaseStatus(asyncBoss, progress, 0)).toBe('ACTIVE');
    expect(getPhaseStatus(asyncBoss, progress, 1)).toBe('LOCKED');
  });

  it('moves to the next phase only after reaching the required score', () => {
    const started = startBoss(createBossProgress(asyncBoss.id));
    const failed = completePhase(asyncBoss, started, 79);
    expect(failed.currentPhaseIndex).toBe(0);

    const cleared = completePhase(asyncBoss, started, 80);
    expect(cleared.currentPhaseIndex).toBe(1);
    expect(cleared.phaseScores['promise-phase']).toBe(80);
  });

  it('clears the boss after the final phase', () => {
    let progress = startBoss(createBossProgress(asyncBoss.id));
    progress = completePhase(asyncBoss, progress, 100);
    progress = completePhase(asyncBoss, progress, 100);
    progress = completePhase(asyncBoss, progress, 100);

    expect(progress.status).toBe('CLEARED');
    expect(progress.currentPhaseIndex).toBe(2);
  });
});
