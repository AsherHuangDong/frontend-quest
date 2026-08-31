import { describe, it, expect } from 'vitest';
import {
  discoveryInstance,
  applicationPool,
  pickApplication,
  readySignal,
} from './instances';
import {
  runPin,
  initialLearned,
  applyApplicationCommit,
  ordinalHeuristicHit,
} from './engine';

describe('relational true rule R', () => {
  it('discovery: only ready signal yields full', () => {
    for (const s of discoveryInstance.signals) {
      const o = runPin(discoveryInstance, s.id);
      expect(o.success).toBe(s.role === 'ready');
      expect(o.load).toBe(s.role === 'ready' ? 'full' : 'empty');
    }
  });

  it('all application instances: exactly one ready', () => {
    for (const inst of applicationPool) {
      const readies = inst.signals.filter((s) => s.role === 'ready');
      expect(readies).toHaveLength(1);
      const o = runPin(inst, readies[0]!.id);
      expect(o.success).toBe(true);
    }
  });

  it('discovery and application ids are disjoint', () => {
    const dIds = new Set(discoveryInstance.signals.map((s) => s.id));
    for (const inst of applicationPool) {
      for (const s of inst.signals) {
        expect(dIds.has(s.id)).toBe(false);
      }
    }
  });
});

describe('LEARNED = first application commit hit', () => {
  it('first hit sets learned true', () => {
    const app = applicationPool[0]!;
    const ready = readySignal(app);
    const outcome = runPin(app, ready.id);
    const next = applyApplicationCommit(initialLearned(), outcome, true);
    expect(next.learned).toBe(true);
    expect(next.firstAppCommitHit).toBe(true);
    expect(next.clearedBySearch).toBe(false);
  });

  it('first miss then later hit: learned stays false, clearedBySearch true', () => {
    const app = applicationPool[0]!;
    const noise = app.signals.find((s) => s.role !== 'ready')!;
    const ready = readySignal(app);
    let state = initialLearned();
    state = applyApplicationCommit(state, runPin(app, noise.id), true);
    expect(state.learned).toBe(false);
    expect(state.firstAppCommitHit).toBe(false);
    state = applyApplicationCommit(state, runPin(app, ready.id), false);
    expect(state.learned).toBe(false);
    expect(state.clearedBySearch).toBe(true);
  });

  it('discovery success does not use applyApplicationCommit path for learned', () => {
    const state = initialLearned();
    expect(state.learned).toBe(false);
  });
});

describe('anti position heuristics across shuffle pool', () => {
  it('no single fixed ordinal hits ready on all three apps', () => {
    for (const ord of [1, 2, 3, 4]) {
      const hits = applicationPool.filter((inst) =>
        ordinalHeuristicHit(inst, ord),
      ).length;
      expect(hits).toBeLessThan(applicationPool.length);
    }
  });

  it('pickApplication returns pool member', () => {
    expect(applicationPool.map((a) => a.id)).toContain(pickApplication(0).id);
    expect(applicationPool.map((a) => a.id)).toContain(pickApplication(1).id);
    expect(applicationPool.map((a) => a.id)).toContain(pickApplication(2).id);
  });
});
