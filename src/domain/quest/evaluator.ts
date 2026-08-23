import type {
  Challenge,
  ChallengeEvaluator,
  ChoiceChallenge,
  EvaluationResult,
  OutputChallenge,
} from './types';

const choiceEvaluator: ChallengeEvaluator<ChoiceChallenge> = {
  evaluate(challenge, answer): EvaluationResult {
    const passed = challenge.correctAnswer === answer;

    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed
        ? '正确！Promise 用于管理异步操作的状态与结果。'
        : '答案不正确。重新理解 Promise 如何管理异步操作，再挑战一次。',
    };
  },
};

const outputEvaluator: ChallengeEvaluator<OutputChallenge> = {
  evaluate(challenge, answer): EvaluationResult {
    const passed = challenge.correctAnswer === answer;

    return {
      passed,
      score: passed ? 100 : 0,
      feedback: passed
        ? '输出正确！你正确理解了 JavaScript 的执行顺序。'
        : '输出顺序不正确。重新梳理同步代码与异步任务的执行顺序。',
    };
  },
};

const unsupportedCodeEvaluator: ChallengeEvaluator = {
  evaluate(): EvaluationResult {
    return {
      passed: false,
      score: 0,
      feedback: '代码题的自动判题引擎将在后续版本接入 Sandbox，目前暂不可提交。',
    };
  },
};

const evaluators: Record<Challenge['type'], ChallengeEvaluator> = {
  choice: choiceEvaluator,
  output: outputEvaluator,
  code: unsupportedCodeEvaluator,
};

export function evaluateChallenge(
  challenge: Challenge,
  answer: string,
): EvaluationResult {
  return evaluators[challenge.type].evaluate(challenge, answer);
}
