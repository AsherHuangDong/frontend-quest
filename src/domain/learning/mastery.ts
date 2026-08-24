import type { LearningProfile, QuestLearningMeta, SkillDimension } from './types';

const dimensions: SkillDimension[] = ['recall', 'understand', 'apply', 'debug', 'transfer', 'retention'];

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function createLearningProfile(): LearningProfile {
  return { mode: 'adaptive', skills: {} };
}

export function updateMastery(
  profile: LearningProfile,
  meta: QuestLearningMeta,
  score: number,
  now: string,
): LearningProfile {
  const skills = { ...profile.skills };
  for (const skillId of meta.skillIds) {
    const previous = skills[skillId];
    const scores = previous?.scores ?? Object.fromEntries(dimensions.map((d) => [d, 0])) as Record<SkillDimension, number>;
    const nextScores = { ...scores };
    for (const dimension of meta.dimensions) {
      nextScores[dimension] = clamp(Math.round(scores[dimension] * 0.7 + score * 0.3));
    }
    skills[skillId] = {
      skillId,
      scores: nextScores,
      attempts: (previous?.attempts ?? 0) + 1,
      lastAttemptAt: now,
      nextReviewAt: null,
    };
  }
  return { ...profile, skills };
}
