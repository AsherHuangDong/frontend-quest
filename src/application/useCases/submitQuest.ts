import { evaluateChallenge } from '../../domain/quest/evaluator';
import { calculateScore } from '../../domain/quest/scoring';
import type { EvaluationResult, Quest } from '../../domain/quest/types';
import type { Player } from '../../domain/player/types';
import type { ProgressMap, QuestProgress } from '../../domain/progress/types';
import { quests } from '../../content/quests';

export interface SubmitQuestResult {
  evaluation: EvaluationResult;
  progress: QuestProgress;
  player: Player;
  unlockedQuestIds: string[];
}

export function submitQuest(
  quest: Quest,
  answer: string,
  player: Player,
  progress: ProgressMap,
  hintsUsed = 0,
): SubmitQuestResult {
  const baseEvaluation = evaluateChallenge(quest.challenge, answer);
  const evaluation: EvaluationResult = {
    ...baseEvaluation,
    score: calculateScore(hintsUsed, baseEvaluation.passed),
  };
  const previous = progress[quest.id];

  const nextProgress: QuestProgress = {
    questId: quest.id,
    status: evaluation.passed ? 'cleared' : 'available',
    attempts: (previous?.attempts ?? 0) + 1,
    bestScore: Math.max(previous?.bestScore ?? 0, evaluation.score),
    lastScore: evaluation.score,
    clearedAt: evaluation.passed ? new Date().toISOString() : previous?.clearedAt ?? null,
  };

  const nextPlayer: Player = evaluation.passed
    ? { ...player, xp: player.xp + quest.reward.xp }
    : player;

  const nextProgressMap = { ...progress, [quest.id]: nextProgress };
  const unlockedQuestIds = quests
    .filter((candidate) => candidate.prerequisiteQuestIds.includes(quest.id))
    .filter((candidate) => candidate.prerequisiteQuestIds.every(
      (id) => nextProgressMap[id]?.status === 'cleared',
    ))
    .map((candidate) => candidate.id);

  return {
    evaluation,
    progress: nextProgress,
    player: nextPlayer,
    unlockedQuestIds,
  };
}
