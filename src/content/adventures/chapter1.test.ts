import { describe, it, expect } from 'vitest';
import { chapter1, evaluateChapter1 } from './chapter1';
import { evaluateChapterOrder } from '../../domain/adventure/evaluate';

describe('chapter1 content integrity', () => {
  it('has all required fields', () => {
    expect(chapter1.id).toBeTruthy();
    expect(chapter1.title).toBe('金库契约断裂');
    expect(chapter1.knowledgeNodeIds.length).toBeGreaterThan(0);
    expect(chapter1.learnTopic).toBeTruthy();
    expect(chapter1.intro).toBeTruthy();
    expect(chapter1.statusPanel).toHaveLength(3);
    expect(chapter1.actions).toHaveLength(3);
  });

  it('actions ids match correctOrder and initialOrder', () => {
    const actionIds = chapter1.actions.map((a) => a.id);
    expect(new Set(actionIds)).toEqual(new Set(chapter1.correctOrder));
    expect(new Set(actionIds)).toEqual(new Set(chapter1.initialOrder));
  });

  it('correctOrder is different from initialOrder', () => {
    expect(chapter1.correctOrder).not.toEqual(chapter1.initialOrder);
  });
});

describe('evaluateChapter1 / evaluateChapterOrder', () => {
  const keys = chapter1.statusPanel.map((s) => s.key);

  it('returns success for correct order', () => {
    const result = evaluateChapter1(chapter1.correctOrder);
    expect(result.success).toBe(true);
    expect(result.status.payment).toBe('success');
    expect(result.status.ledger).toBe('success');
    expect(result.status.inventory).toBe('success');
  });

  it('returns fail for initial (wrong) order', () => {
    const result = evaluateChapter1(chapter1.initialOrder);
    expect(result.success).toBe(false);
    expect(result.status.payment).toBe('success');
    expect(result.status.ledger).toBe('fail');
    expect(result.status.inventory).toBe('fail');
  });

  it('returns fail for any other wrong order', () => {
    const wrong = ['createOrder', 'payment', 'updateInventory'];
    const result = evaluateChapterOrder(wrong, chapter1.correctOrder, keys);
    expect(result.success).toBe(false);
  });

  it('is deterministic', () => {
    const a = evaluateChapter1(chapter1.correctOrder);
    const b = evaluateChapter1(chapter1.correctOrder);
    expect(a).toEqual(b);
  });
});
