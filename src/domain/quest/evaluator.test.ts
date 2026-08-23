import { describe, expect, it } from 'vitest';
import { evaluateChallenge } from './evaluator';
import type { ChoiceChallenge, OutputChallenge } from './types';

describe('evaluateChallenge', () => {
  it('evaluates a choice challenge', () => {
    const challenge: ChoiceChallenge = {
      type: 'choice',
      question: 'What does Promise manage?',
      options: [{ id: 'a', label: 'Async state' }],
      correctAnswer: 'a',
    };

    expect(evaluateChallenge(challenge, 'a')).toMatchObject({
      passed: true,
      score: 100,
    });
  });

  it('evaluates an output challenge independently of choice challenges', () => {
    const challenge: OutputChallenge = {
      type: 'output',
      question: 'What is logged?',
      options: [{ id: 'b', label: '1 3 2' }],
      correctAnswer: 'b',
    };

    expect(evaluateChallenge(challenge, 'b')).toMatchObject({
      passed: true,
      score: 100,
    });
  });

  it('returns a clear result for unsupported code evaluation', () => {
    const challenge = {
      type: 'code' as const,
      question: 'Implement debounce',
      starterCode: 'function debounce() {}',
      language: 'typescript' as const,
    };

    expect(evaluateChallenge(challenge, 'function debounce() {}')).toMatchObject({
      passed: false,
      score: 0,
    });
  });
});
