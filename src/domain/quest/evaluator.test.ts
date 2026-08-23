import { describe, expect, it } from 'vitest';
import { evaluateChoice } from './evaluator';
import type { ChoiceChallenge } from './types';

const challenge: ChoiceChallenge = {
  type: 'choice',
  question: 'Promise?',
  options: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
  ],
  correctAnswer: 'B',
};

describe('evaluateChoice', () => {
  it('passes the correct answer with 100 points', () => {
    expect(evaluateChoice(challenge, 'B')).toEqual({
      passed: true,
      score: 100,
      feedback: '正确！Promise 用于管理异步操作的状态与结果。',
    });
  });

  it('fails the incorrect answer with 0 points', () => {
    expect(evaluateChoice(challenge, 'A')).toEqual({
      passed: false,
      score: 0,
      feedback: '答案不正确。重新理解 Promise 如何管理异步操作，再挑战一次。',
    });
  });
});
