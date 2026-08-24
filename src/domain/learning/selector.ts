import type { Quest } from '../quest/types';
import type { LearningMode, LearningProfile, QuestLearningMeta } from './types';

interface Candidate {
  quest: Quest;
  meta: QuestLearningMeta;
}

function mastery(profile: LearningProfile, meta: QuestLearningMeta) {
  if (!meta.skillIds.length) return 0;
  const values = meta.skillIds.map((id) => {
    const skill = profile.skills[id];
    if (!skill) return 0;
    return meta.dimensions.reduce((sum, dimension) => sum + skill.scores[dimension], 0) / meta.dimensions.length;
  });
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function selectNextQuest(
  profile: LearningProfile,
  candidates: Candidate[],
  mode: LearningMode = profile.mode,
): Quest | null {
  if (!candidates.length) return null;
  const scored = candidates.map((candidate) => {
    const m = mastery(profile, candidate.meta);
    const difficulty = candidate.quest.difficulty;
    const target = mode === 'explorer' ? 25 : mode === 'master' ? 80 : mode === 'challenger' ? 60 : m;
    const gap = Math.abs(m - target);
    return { candidate, score: gap + (mode === 'master' && difficulty < 3 ? 20 : 0) };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored[0].candidate.quest;
}
