import type { RelationalInstance, RunOutcome, LearnedState } from './types';
import { readySignal } from './instances';

/** True rule R: only ready-role signal yields full load. */
export function runPin(
  instance: RelationalInstance,
  pinnedSignalId: string,
): RunOutcome {
  const ready = readySignal(instance);
  const pinned = instance.signals.find((s) => s.id === pinnedSignalId);
  if (!pinned) {
    throw new Error(`Unknown signal ${pinnedSignalId} in ${instance.id}`);
  }
  const success = pinned.role === 'ready';
  return {
    pinnedSignalId,
    success,
    load: success ? 'full' : 'empty',
    readySignalId: ready.id,
  };
}

export function initialLearned(): LearnedState {
  return {
    learned: false,
    firstAppCommitHit: null,
    clearedBySearch: false,
  };
}

/**
 * Apply an application-phase commit result.
 * Only the first commit sets firstAppCommitHit / learned.
 * Later successes only set clearedBySearch.
 */
export function applyApplicationCommit(
  prev: LearnedState,
  outcome: RunOutcome,
  isFirstCommitOnThisApplication: boolean,
): LearnedState {
  if (!isFirstCommitOnThisApplication) {
    if (outcome.success && !prev.learned) {
      return { ...prev, clearedBySearch: true };
    }
    return prev;
  }
  const hit = outcome.success;
  return {
    learned: hit,
    firstAppCommitHit: hit,
    clearedBySearch: prev.clearedBySearch,
  };
}

/** Fixed-ordinal heuristic success rate helper for tests / pressure checks. */
export function ordinalHeuristicHit(
  instance: RelationalInstance,
  ordinal1Based: number,
): boolean {
  const sorted = [...instance.signals].sort((a, b) => a.order - b.order);
  const target = sorted[ordinal1Based - 1];
  return target?.role === 'ready';
}
