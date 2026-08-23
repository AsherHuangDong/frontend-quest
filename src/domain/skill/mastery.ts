import type { SkillDimension } from '../quest/types';
import type { SkillEvidence, SkillMastery, SkillMasteryMap } from './types';

export function createSkillEvidence(
  questId: string,
  knowledgeNodeIds: string[],
  skillDimension: SkillDimension,
  score: number,
  passed: boolean,
  createdAt = new Date().toISOString(),
  id = `${questId}:${skillDimension}:${createdAt}`,
): SkillEvidence {
  return {
    id,
    questId,
    knowledgeNodeIds,
    skillDimension,
    score,
    passed,
    createdAt,
  };
}

export function calculateSkillMastery(
  evidence: SkillEvidence[],
  skillDimension: SkillDimension,
  updatedAt = new Date().toISOString(),
): SkillMastery | null {
  const skillEvidence = evidence.filter(
    (item) => item.skillDimension === skillDimension,
  );

  if (skillEvidence.length === 0) {
    return null;
  }

  const score = skillEvidence.reduce((sum, item) => sum + item.score, 0) / skillEvidence.length;

  return {
    skillDimension,
    score,
    evidenceCount: skillEvidence.length,
    updatedAt,
  };
}

export function calculateSkillMasteryMap(
  evidence: SkillEvidence[],
  updatedAt = new Date().toISOString(),
): SkillMasteryMap {
  const dimensions = new Set(evidence.map((item) => item.skillDimension));
  const mastery: SkillMasteryMap = {};

  for (const skillDimension of dimensions) {
    const result = calculateSkillMastery(evidence, skillDimension, updatedAt);

    if (result) {
      mastery[skillDimension] = result;
    }
  }

  return mastery;
}
