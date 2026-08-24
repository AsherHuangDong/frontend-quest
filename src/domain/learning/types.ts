export type SkillDimension = 'recall' | 'understand' | 'apply' | 'debug' | 'transfer' | 'retention';

export type LearningMode = 'explorer' | 'challenger' | 'master' | 'adaptive';

export interface SkillMastery {
  skillId: string;
  scores: Record<SkillDimension, number>;
  attempts: number;
  lastAttemptAt: string | null;
  nextReviewAt: string | null;
}

export interface LearningProfile {
  mode: LearningMode;
  skills: Record<string, SkillMastery>;
}

export interface QuestLearningMeta {
  questId: string;
  skillIds: string[];
  dimensions: SkillDimension[];
  minDifficulty: 1 | 2 | 3 | 4 | 5;
}
