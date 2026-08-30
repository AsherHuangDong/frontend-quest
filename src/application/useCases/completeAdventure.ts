import type { AdventureChapter } from '../../domain/adventure/types';
import type { Player } from '../../domain/player/types';
import type { ProgressMap, QuestProgress } from '../../domain/progress/types';
import type { SkillEvidence, SkillMasteryMap } from '../../domain/skill/types';
import type { ReviewStateMap } from '../../domain/review/types';
import {
  calculateSkillMasteryMap,
  createSkillEvidence,
} from '../../domain/skill/mastery';
import { applyQuestOutcomeToReview } from '../../domain/review/review';
import { advanceStreak } from '../../domain/player/streak';

const ADVENTURE_SKILL_DIMENSIONS = ['understand', 'apply'] as const;

/** @deprecated use chapter.rewardXp */
export const CHAPTER1_REWARD_XP = 40;

export interface CompleteAdventureInput {
  chapter: AdventureChapter;
  player: Player;
  progress: ProgressMap;
  skillEvidence: SkillEvidence[];
  currentStreak: number;
  bestStreak: number;
  review: ReviewStateMap;
  now?: string;
}

export interface CompleteAdventureResult {
  player: Player;
  progress: ProgressMap;
  newEvidence: SkillEvidence[];
  skillEvidence: SkillEvidence[];
  skillMastery: SkillMasteryMap;
  currentStreak: number;
  bestStreak: number;
  review: ReviewStateMap;
  alreadyCleared: boolean;
  awardedXp: number;
}

function buildChapterProgress(
  chapterId: string,
  previous: QuestProgress | undefined,
  now: string,
  passed: boolean,
): QuestProgress {
  const attempts = (previous?.attempts ?? 0) + 1;
  const score = passed ? 100 : 0;

  if (previous?.status === 'cleared') {
    return {
      ...previous,
      attempts,
      lastScore: score,
      bestScore: Math.max(previous.bestScore, score),
    };
  }

  return {
    questId: chapterId,
    status: passed ? 'cleared' : 'available',
    attempts,
    bestScore: Math.max(previous?.bestScore ?? 0, score),
    lastScore: score,
    clearedAt: passed ? now : previous?.clearedAt ?? null,
  };
}

export function completeAdventure(input: CompleteAdventureInput): CompleteAdventureResult {
  const now = input.now ?? new Date().toISOString();
  const { chapter } = input;
  const previous = input.progress[chapter.id];
  const alreadyCleared = previous?.status === 'cleared';
  const passed = true;

  const chapterProgress = buildChapterProgress(chapter.id, previous, now, passed);
  const nextProgress: ProgressMap = {
    ...input.progress,
    [chapter.id]: chapterProgress,
  };

  const newEvidence = ADVENTURE_SKILL_DIMENSIONS.map((skillDimension, index) =>
    createSkillEvidence(
      chapter.id,
      chapter.knowledgeNodeIds,
      skillDimension,
      100,
      true,
      now,
      `${chapter.id}:${skillDimension}:${now}:${index}`,
    ),
  );

  const skillEvidence = [...input.skillEvidence, ...newEvidence];
  const skillMastery = calculateSkillMasteryMap(skillEvidence, now);

  const review = applyQuestOutcomeToReview(
    input.review,
    chapter.knowledgeNodeIds,
    true,
    now,
  );

  const streak = alreadyCleared
    ? { current: input.currentStreak, best: input.bestStreak, bonusXp: 0 }
    : advanceStreak(input.currentStreak, input.bestStreak, true);

  const baseXp = chapter.rewardXp ?? CHAPTER1_REWARD_XP;
  const awardedXp = alreadyCleared ? 0 : baseXp + streak.bonusXp;

  const player: Player = {
    ...input.player,
    xp: input.player.xp + awardedXp,
  };

  return {
    player,
    progress: nextProgress,
    newEvidence,
    skillEvidence,
    skillMastery,
    currentStreak: streak.current,
    bestStreak: streak.best,
    review,
    alreadyCleared,
    awardedXp,
  };
}
