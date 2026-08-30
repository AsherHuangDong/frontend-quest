import { describe, it, expect } from 'vitest';
import { volume1Scenes, sceneA, sceneB, sceneC } from './scenes';
import { runScene } from './evaluate';

describe('volume1 scenes', () => {
  it('has three scenes with matching step ids', () => {
    expect(volume1Scenes).toHaveLength(3);
    for (const scene of volume1Scenes) {
      const ids = scene.steps.map((s) => s.id);
      expect(new Set(ids)).toEqual(new Set(scene.correctOrder));
      expect(new Set(ids)).toEqual(new Set(scene.initialOrder));
      expect(scene.correctOrder).not.toEqual(scene.initialOrder);
    }
  });

  it('scene A: designed fail then pass', () => {
    expect(runScene(sceneA, sceneA.initialOrder).ok).toBe(false);
    expect(runScene(sceneA, sceneA.correctOrder).ok).toBe(true);
  });

  it('scene B: routine-before-urgent fails', () => {
    expect(runScene(sceneB, sceneB.initialOrder).ok).toBe(false);
    expect(runScene(sceneB, sceneB.correctOrder).ok).toBe(true);
  });

  it('scene C: seal-before-north fails', () => {
    expect(runScene(sceneC, sceneC.initialOrder).ok).toBe(false);
    expect(runScene(sceneC, sceneC.correctOrder).ok).toBe(true);
  });
});
