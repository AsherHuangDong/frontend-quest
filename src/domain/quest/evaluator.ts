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
        ? '判断正确。你抓住了这道概念题的关键点。'
        : '还差一点。先看提示或回顾相关概念，再试一次——错误是定位盲区的信号。',
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
        ? '输出顺序正确。你已经能把同步与异步任务分开想了。'
        : '顺序还对不上。试着先标出「同步立刻执行」和「微任务稍后执行」，再重试。',
    };
  },
};

const unsupportedCodeEvaluator: ChallengeEvaluator = {
  evaluate(): EvaluationResult {
    return {
      passed: false,
      score: 0,
      feedback: '代码题的自动判题会在后续版本接入。这不影响你继续挑战其他任务。',
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
