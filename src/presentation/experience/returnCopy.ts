import type { ReviewStateMap } from '../../domain/review/types';
import { listDueKnowledgeNodeIds } from '../../domain/review/review';

const HALF_DAY_MS = 12 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ReturnBanner {
  title: string;
  body: string;
  tone: 'return' | 'review';
}

export function hoursAway(lastActiveAt: string | null | undefined, now: string): number | null {
  if (!lastActiveAt) return null;
  const delta = new Date(now).getTime() - new Date(lastActiveAt).getTime();
  if (delta < HALF_DAY_MS) return null;
  return Math.max(1, Math.round(delta / (60 * 60 * 1000)));
}

/**
 * No-guilt return + review messaging.
 * Prefer a single banner: return-with-due > return > review-only.
 */
export function buildHubStatusBanner(input: {
  lastActiveAt: string | null | undefined;
  review: ReviewStateMap;
  now?: string;
}): ReturnBanner | null {
  const now = input.now ?? new Date().toISOString();
  const due = listDueKnowledgeNodeIds(input.review, now);
  const awayHours = hoursAway(input.lastActiveAt, now);

  if (awayHours !== null && due.length > 0) {
    const days = awayHours >= 24 ? Math.round(awayHours / 24) : null;
    return {
      tone: 'return',
      title: '欢迎回来',
      body:
        days && days >= 1
          ? `你离开了大约 ${days} 天。部分知识适合再加固一下——这不是退步，只是正常的记忆规律。准备好了就从复习开始。`
          : `你离开了一段时间。有 ${due.length} 个知识点适合复习——不是惩罚，只是帮记忆再稳一点。`,
    };
  }

  if (awayHours !== null) {
    const days = awayHours >= 24 ? Math.round(awayHours / 24) : null;
    return {
      tone: 'return',
      title: '欢迎回来',
      body:
        days && days >= 1
          ? `你离开了大约 ${days} 天。进度还在，随时可以从「下一题」继续。`
          : '欢迎回来。进度还在本地，想练的时候点「下一题」就好。',
    };
  }

  if (due.length > 0) {
    return {
      tone: 'review',
      title: `有 ${due.length} 个知识点适合复习了`,
      body: `不是进度倒退，只是记忆需要再加固：${due.join(', ')}`,
    };
  }

  return null;
}

/** Used in tests / diagnostics. */
export function isReturnWindow(lastActiveAt: string | null | undefined, now: string): boolean {
  return hoursAway(lastActiveAt, now) !== null;
}

export const RETURN_THRESHOLDS = { HALF_DAY_MS, DAY_MS };
