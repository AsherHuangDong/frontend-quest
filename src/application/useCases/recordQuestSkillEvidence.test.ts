import { describe, expect, it } from 'vitest';
import type { EvaluationResult, Quest } from '../../domain/quest/types';
import type { SkillEvidence } from '../../domain/skill/types';
import { recordQuestSkillEvidence } from './recordQuestSkillEvidence';

const quest: Quest = {
  id: 'async-await-final',
  chapterId: 'async-chapter',
  title: 'Async Await Final',
  description: 'Test async and await.',
  difficulty: 3,
  challenge: {
    type: 'choice',
    question: 'Which keyword waits for a promise?',
    options: [
      { id: 'a', label: 'await' },
      { id: 'b', label: 'yield' },
    ],
    correctAnswer: 'a',
  },
  reward: { xp: 100 },
  prerequisiteQuestIds: [],
  knowledgeNodeIds: ['promise', 'event-loop', 'async-await'],
  skillDimensions: ['understand', 'apply'],
  type: 'understand',
};

const evaluation: EvaluationResult = {
  passed: true,
  score: 80,
  feedback: 'Correct',
};

describe('recordQuestSkillEvidence', () => {
  it('creates one evidence item for every skill dimension', () => {
    const result = recordQuestSkillEvidence(
      quest,
      evaluation,
      [],
      '2026-08-23T12:00:00.000Z',
    );

    expect(result.evidence).toHaveLength(2);
    expect(result.evidence.map((item) => item.skillDimension)).toEqual([
      'understand',
      'apply',
    ]);
    expect(result.evidence.every((item) => item.score === 80 && item.passed)).toBe(true);
  });

  it('keeps previous evidence when calculating mastery', () => {
    const previousEvidence: SkillEvidence[] = [
      {
        id: 'previous',
        questId: 'previous-quest',
        knowledgeNodeIds: ['promise'],
        skillDimension: 'understand',
        score: 100,
        passed: true,
        createdAt: '2026-08-23T11:00:00.000Z',
      },
    ];

    const result = recordQuestSkillEvidence(
      quest,
      evaluation,
      previousEvidence,
      '2026-08-23T12:00:00.000Z',
    );

    expect(result.mastery.understand?.score).toBe(90);
    expect(result.mastery.understand?.evidenceCount).toBe(2);
    expect(result.mastery.apply?.score).toBe(80);
  });

  it('records failed evaluations as evidence', () => {
    const result = recordQuestSkillEvidence(
      quest,
      { ...evaluation, passed: false, score: 40 },
      [],
      '2026-08-23T12:00:00.000Z',
    );

    expect(result.evidence.every((item) => !item.passed && item.score === 40)).toBe(true);
  });
});
