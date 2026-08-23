import type { SkillDimension } from '../quest/types';

export interface SkillEvidence {
  id: string;
  questId: string;
  knowledgeNodeIds: string[];
  skillDimension: SkillDimension;
  score: number;
  passed: boolean;
  createdAt: string;
}

export interface SkillMastery {
  skillDimension: SkillDimension;
  score: number;
  evidenceCount: number;
  updatedAt: string;
}

export type SkillMasteryMap = Partial<Record<SkillDimension, SkillMastery>>;
