import type { AdventureEvaluationResult, AdventureStatusKey } from './types';

/**
 * Deterministic evaluation of the player's step order.
 * Does not execute any user code — only compares order.
 */
export function evaluateChapterOrder(
  playerOrder: string[],
  correctOrder: string[],
): AdventureEvaluationResult {
  const success =
    playerOrder.length === correctOrder.length &&
    playerOrder.every((id, index) => id === correctOrder[index]);

  const status: Record<AdventureStatusKey, 'success' | 'fail'> = {
    payment: 'success', // payment contract always shows completed
    ledger: success ? 'success' : 'fail',
    inventory: success ? 'success' : 'fail',
  };

  return { success, status };
}
