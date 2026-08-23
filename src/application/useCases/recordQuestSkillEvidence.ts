import type { EvaluationResult, Quest } from '../../domain/quest/types';
import {
  calculateSkillMasteryMap,
  createSkillEvidence,
} from '../../domain/skill/mastery';
import type { SkillEvidence, SkillMasteryMap } from '../../domain/skill/types';

export interface RecordQuestSkillEvidenceResult {
  evidence: SkillEvidence[];
  mastery: SkillMasteryMap;
}

export function recordQuestSkillEvidence(
  quest: Quest,
  evaluation: EvaluationResult,
  previousEvidence: SkillEvidence[] = [],
  createdAt = new Date().toISOString(),
): RecordQuestSkillEvidenceResult {
  const newEvidence = quest.skillDimensions.map((skillDimension, index) =>
    createSkillEvidence(
      quest.id,
      quest.knowledgeNodeIds,
      skillDimension,
      evaluation.score,
      evaluation.passed,
      createdAt,
      `${quest.id}:${skillDimension}:${createdAt}:${index}`,
    ),
  );

  const evidence = [...previousEvidence, ...newEvidence];

  return {
    evidence: newEvidence,
    mastery: calculateSkillMasteryMap(evidence, createdAt),
  };
}
