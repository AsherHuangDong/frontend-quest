import { describe, it, expect } from 'vitest';
import { chapter2, evaluateChapter2 } from './chapter2';
import { evaluateChapterOrder } from '../../domain/adventure/evaluate';
import { isChapterUnlocked } from './index';

describe('chapter2 content integrity', () => {
  it('has microtask knowledge and prerequisite on chapter 1', () => {
    expect(chapter2.knowledgeNodeIds).toContain('microtask');
    expect(chapter2.prerequisiteChapterIds).toContain('chapter-1-vault-contract');
    expect(chapter2.learnTopic).toMatch(/microtask|微任务/i);
  });

  it('actions ids match orders', () => {
    const actionIds = chapter2.actions.map((a) => a.id);
    expect(new Set(actionIds)).toEqual(new Set(chapter2.correctOrder));
    expect(new Set(actionIds)).toEqual(new Set(chapter2.initialOrder));
  });

  it('correct order is sync → micro → macro', () => {
    expect(chapter2.correctOrder).toEqual(['gateBell', 'contractEcho', 'drumLate']);
  });
});

describe('evaluateChapter2', () => {
  it('passes correct order', () => {
    const result = evaluateChapter2(chapter2.correctOrder);
    expect(result.success).toBe(true);
    expect(result.status.sync).toBe('success');
    expect(result.status.micro).toBe('success');
    expect(result.status.macro).toBe('success');
  });

  it('fails common setTimeout-before-then order', () => {
    const result = evaluateChapter2(chapter2.initialOrder);
    expect(result.success).toBe(false);
    expect(result.status.sync).toBe('success');
    expect(result.status.micro).toBe('fail');
    expect(result.status.macro).toBe('fail');
  });

  it('unlock requires chapter 1 cleared', () => {
    expect(isChapterUnlocked(chapter2, {})).toBe(false);
    expect(
      isChapterUnlocked(chapter2, {
        'chapter-1-vault-contract': { status: 'cleared' },
      }),
    ).toBe(true);
  });
});
