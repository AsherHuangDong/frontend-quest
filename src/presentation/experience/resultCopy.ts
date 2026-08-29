import type { EvaluationResult, Quest } from '../../domain/quest/types';

export interface ResultCopy {
  title: string;
  lead: string;
  detail: string;
  encouragement: string;
}

/** Coach-tone presentation copy; does not change EvaluationResult scoring. */
export function buildResultCopy(
  quest: Quest,
  result: EvaluationResult,
  options: { hintsUsed: number; attempts: number },
): ResultCopy {
  if (result.passed) {
    return {
      title: '过关了',
      lead: `「${quest.title}」已完成。`,
      detail: result.feedback,
      encouragement:
        options.hintsUsed > 0
          ? '提示帮你补上了缺口——下次可以试着少看提示独立完成。'
          : '继续下一题，把这种判断感练扎实。',
    };
  }

  const attemptHint =
    options.attempts >= 2
      ? '已经试过几次了，建议先点「提示」再重试。'
      : '一次没过很正常，先用提示缩小范围再试。';

  return {
    title: '先停一下，再试一次',
    lead: '这不是能力不够，只是还没对准这个盲区。',
    detail: result.feedback,
    encouragement: attemptHint,
  };
}
