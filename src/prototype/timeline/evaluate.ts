import type { RunResult, TimelineScene } from './types';

/** Compare player order to correct order; board mirrors world state. */
export function runScene(scene: TimelineScene, order: string[]): RunResult {
  const ok =
    order.length === scene.correctOrder.length &&
    order.every((id, i) => id === scene.correctOrder[i]);

  const board: Record<string, 'stable' | 'chaos'> = {};
  scene.statuses.forEach((s, index) => {
    // First line often already "happened"; rest flip with overall ok.
    board[s.key] = ok || index === 0 ? 'stable' : 'chaos';
  });

  return { ok, board };
}
