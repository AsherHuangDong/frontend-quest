import { describe, expect, it } from 'vitest';
import type { SkillEvidence } from './types';
import { calculateSkillMastery, calculateSkillMasteryMap, createSkillEvidence } from './mastery';

const evidence: SkillEvidence[] = [
  createSkillEvidence('quest-1', ['promise'], 'understand', 100, true, '2026-08-23T10:00:00.000Z', 'evidence-1'),
  createSkillEvidence('quest-2', ['microtask'], 'understand', 60, false, '2026-08-23T10:01:00.000Z', 'evidence-2'),
  createSkillEvidence('quest-3', ['event-loop'], 'apply', 80, true, '2026-08-23T10:02:00.000Z', 'evidence-3'),
];

describe('skill mastery', () => {
  it('creates evidence from a quest evaluation', () => {
    expect(evidence[0]).toEqual({
      id: 'evidence-1',
      questId: 'quest-1',
      knowledgeNodeIds: ['promise'],
      skillDimension: 'understand',
      score: 100,
      passed: true,
      createdAt: '2026-08-23T10:00:00.000Z',
    });
  });

  it('calculates mastery as the average evidence score', () => {
    expect(calculateSkillMastery(evidence, 'understand', '2026-08-23T11:00:00.000Z')).toEqual({
      skillDimension: 'understand',
      score: 80,
      evidenceCount: 2,
      updatedAt: '2026-08-23T11:00:00.000Z',
    });
  });

  it('includes both passed and failed evidence', () => {
    const mastery = calculateSkillMastery(evidence, 'understand');

    expect(mastery?.evidenceCount).toBe(2);
    expect(mastery?.score).toBe(80);
  });

  it('returns null when there is no evidence', () => {
    expect(calculateSkillMastery(evidence, 'debug')).toBeNull();
  });

  it('calculates mastery independently for each skill dimension', () => {
    expect(calculateSkillMasteryMap(evidence, '2026-08-23T11:00:00.000Z')).toEqual({
      understand: {
        skillDimension: 'understand',
        score: 80,
        evidenceCount: 2,
        updatedAt: '2026-08-23T11:00:00.000Z',
      },
      apply: {
        skillDimension: 'apply',
        score: 80,
        evidenceCount: 1,
        updatedAt: '2026-08-23T11:00:00.000Z',
      },
    });
  });
});
