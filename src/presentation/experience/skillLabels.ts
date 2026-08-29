import type { SkillDimension } from '../../domain/quest/types';

const LABELS: Record<SkillDimension, string> = {
  recall: '记忆',
  understand: '理解',
  apply: '应用',
  debug: '调试',
  transfer: '迁移',
};

export function skillLabel(dimension: SkillDimension | string): string {
  return LABELS[dimension as SkillDimension] ?? dimension;
}
