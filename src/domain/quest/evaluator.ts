import type { ChoiceChallenge, EvaluationResult } from './types';

export function evaluateChoice(
  challenge: ChoiceChallenge,
  answer: string,
): EvaluationResult {
  const passed = challenge.correctAnswer === answer;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? '正确！Promise 用于管理异步操作的状态与结果。'
      : '答案不正确。重新理解 Promise 如何管理异步操作，再挑战一次。',
  };
}
