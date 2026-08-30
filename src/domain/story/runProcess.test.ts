import { describe, it, expect } from 'vitest';
import { granaryIncident } from '../../content/story/granaryIncident';
import { initialBoard, runProcess } from './runProcess';

describe('runProcess granary', () => {
  it('fails wrong order and keeps alarm', () => {
    const r = runProcess(granaryIncident, ['merchant', 'keeper', 'clerk']);
    expect(r.ok).toBe(false);
    expect(r.board.alarm).toBe(true);
    expect(r.board.gateOpen).toBe(false);
  });

  it('passes correct order and opens gate', () => {
    const r = runProcess(granaryIncident, granaryIncident.correctOrder);
    expect(r.ok).toBe(true);
    expect(r.board.alarm).toBe(false);
    expect(r.board.gateOpen).toBe(true);
    expect(r.board.actorStates.merchant).toBe('done');
    expect(r.board.actorStates.clerk).toBe('done');
    expect(r.board.actorStates.keeper).toBe('done');
  });

  it('initial board: payment done, others blocked, alarm on', () => {
    const b = initialBoard(granaryIncident);
    expect(b.alarm).toBe(true);
    expect(b.actorStates.merchant).toBe('done');
    expect(b.actorStates.clerk).toBe('blocked');
  });
});
