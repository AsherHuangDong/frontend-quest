import type { SceneBoard, SceneRunResult, StoryScene } from './types';

/**
 * Run the player's process line against the scene rule.
 * Deterministic: compares order only; updates board for UI.
 */
export function runProcess(
  scene: StoryScene,
  processOrder: string[],
): SceneRunResult {
  const ok =
    processOrder.length === scene.correctOrder.length &&
    processOrder.every((id, i) => id === scene.correctOrder[i]);

  const actorStates: Record<string, SceneBoard['actorStates'][string]> = {};

  for (const actor of scene.actors) {
    if (ok) {
      actorStates[actor.id] = 'done';
    } else {
      const idx = processOrder.indexOf(actor.id);
      const correctIdx = scene.correctOrder.indexOf(actor.id);
      if (idx === -1) {
        actorStates[actor.id] = 'blocked';
      } else if (idx === correctIdx && processOrder.slice(0, idx + 1).every((id, i) => id === scene.correctOrder[i])) {
        // prefix correct so far
        actorStates[actor.id] = idx === processOrder.length - 1 ? 'wrong' : 'done';
      } else {
        actorStates[actor.id] = idx < correctIdx ? 'wrong' : 'blocked';
      }
    }
  }

  // Simpler readable board for granary:
  if (!ok) {
    // payment (first in correct) often already "done" in story
    const first = scene.correctOrder[0];
    for (const actor of scene.actors) {
      if (actor.id === first) {
        actorStates[actor.id] = 'done';
      } else {
        actorStates[actor.id] = 'wrong';
      }
    }
  }

  return {
    ok,
    board: {
      actorStates,
      alarm: !ok,
      gateOpen: ok,
    },
  };
}

/** Initial board: money in, ledger empty, goods waiting. */
export function initialBoard(scene: StoryScene): SceneBoard {
  const actorStates: SceneBoard['actorStates'] = {};
  scene.actors.forEach((actor, i) => {
    actorStates[actor.id] = i === 0 ? 'done' : 'blocked';
  });
  return { actorStates, alarm: true, gateOpen: false };
}
