import { describe, expect, it } from 'vitest';
import { createLearningProfile, updateMastery } from './mastery';
import { getUnlockedNodes } from './knowledgeGraph';
import { scheduleNextReview } from './review';
import { selectNextQuest } from './selector';
import type { Quest } from '../quest/types';
import type { QuestLearningMeta } from './types';

const quest = (id: string, difficulty: 1 | 2 | 3 | 4 | 5): Quest => ({
  id,
  chapterId: 'js',
  title: id,
  description: '',
  difficulty,
  prerequisiteQuestIds: [],
  reward: { xp: 10 },
  challenge: { type: 'choice', question: '', options: [], correctAnswer: 'A' },
});

const meta = (questId: string, skillId: string): QuestLearningMeta => ({
  questId,
  skillIds: [skillId],
  dimensions: ['understand'],
  minDifficulty: 1,
});

describe('learning engine', () => {
  it('updates skill mastery without jumping directly to 100', () => {
    let profile = createLearningProfile();
    profile = updateMastery(profile, meta('q1', 'promise'), 100, '2026-08-23T00:00:00.000Z');
    expect(profile.skills.promise.scores.understand).toBe(30);
    expect(profile.skills.promise.attempts).toBe(1);
  });

  it('selects a quest according to the learning mode', () => {
    const profile = createLearningProfile();
    const selected = selectNextQuest(profile, [
      { quest: quest('easy', 1), meta: meta('easy', 'new-skill') },
      { quest: quest('hard', 4), meta: meta('new-skill', 'hard-skill') },
    ], 'explorer');
    expect(selected?.id).toBe('easy');
  });

  it('finds only knowledge nodes whose prerequisites are mastered', () => {
    const nodes = {
      promise: { id: 'promise', title: 'Promise', prerequisiteNodeIds: [] },
      microtask: { id: 'microtask', title: 'Microtask', prerequisiteNodeIds: ['promise'] },
    };
    expect(getUnlockedNodes({ nodes }, ['promise']).map((n) => n.id)).toEqual(['microtask']);
  });

  it('schedules stronger retention for higher mastery', () => {
    const low = scheduleNextReview({
      skillId: 'promise', attempts: 1, lastAttemptAt: null, nextReviewAt: null,
      scores: { recall: 0, understand: 0, apply: 0, debug: 0, transfer: 0, retention: 40 },
    }, new Date('2026-08-23T00:00:00.000Z'));
    const high = scheduleNextReview({
      skillId: 'promise', attempts: 5, lastAttemptAt: null, nextReviewAt: null,
      scores: { recall: 0, understand: 0, apply: 0, debug: 0, transfer: 0, retention: 95 },
    }, new Date('2026-08-23T00:00:00.000Z'));
    expect(new Date(high).getTime()).toBeGreaterThan(new Date(low).getTime());
  });
});
