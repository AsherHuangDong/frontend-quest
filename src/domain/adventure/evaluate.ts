import type { AdventureEvaluationResult } from './types';

/**
 * Deterministic evaluation of the player's step order.
 * Does not execute any user code — only compares order.
 *
 * Status panel: first key stays "ambient success" on failure
 * (story: something already happened); remaining keys flip with overall success.
 */
export function evaluateChapterOrder(
  playerOrder: string[],
  correctOrder: string[],
  statusKeys: string[] = [],
): AdventureEvaluationResult {
  const success =
    playerOrder.length === correctOrder.length &&
    playerOrder.every((id, index) => id === correctOrder[index]);

  const status: Record<string, 'success' | 'fail'> = {};
  statusKeys.forEach((key, index) => {
    status[key] = success || index === 0 ? 'success' : 'fail';
  });

  return { success, status };
}
