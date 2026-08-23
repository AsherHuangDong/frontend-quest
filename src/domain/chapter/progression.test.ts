import { describe, expect, it } from 'vitest';
import { getChapterStatus } from './progression';
import type { ChapterDefinition } from './types';

const chapters: ChapterDefinition[] = [
  {
    id: 'js',
    title: 'JavaScript',
    description: '',
    order: 1,
    questIds: ['q1', 'q2'],
    bossId: 'b1',
    prerequisiteChapterIds: [],
  },
  {
    id: 'ts',
    title: 'TypeScript',
    description: '',
    order: 2,
    questIds: ['q3'],
    bossId: 'b2',
    prerequisiteChapterIds: ['js'],
  },
];

describe('chapter progression', () => {
  it('makes the first chapter available', () => {
    expect(getChapterStatus(chapters[0], chapters, [], [])).toBe('AVAILABLE');
  });

  it('marks a chapter in progress after its first quest is cleared', () => {
    expect(getChapterStatus(chapters[0], chapters, ['q1'], [])).toBe('IN_PROGRESS');
  });

  it('requires all quests and the boss before clearing a chapter', () => {
    expect(getChapterStatus(chapters[0], chapters, ['q1', 'q2'], [])).toBe('IN_PROGRESS');
    expect(getChapterStatus(chapters[0], chapters, ['q1', 'q2'], ['b1'])).toBe('CLEARED');
  });

  it('locks a chapter until its prerequisite chapter is cleared', () => {
    expect(getChapterStatus(chapters[1], chapters, ['q1', 'q2'], ['b1'])).toBe('AVAILABLE');
    expect(getChapterStatus(chapters[1], chapters, ['q1'], ['b1'])).toBe('LOCKED');
  });
});
