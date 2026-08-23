import { describe, expect, it } from 'vitest';
import { asyncKnowledgeNodes } from './knowledge/asyncWorld';
import { quests } from './quests';

const knowledgeNodeIds = new Set(asyncKnowledgeNodes.map((node) => node.id));

const skillDimensions = new Set([
  'recall',
  'understand',
  'apply',
  'debug',
  'transfer',
]);

const questTypes = new Set(['explore', 'understand', 'reason', 'debug']);

describe('quest content schema', () => {
  it('defines learning metadata for every quest', () => {
    expect(quests).toHaveLength(6);

    for (const quest of quests) {
      expect(quest.knowledgeNodeIds.length).toBeGreaterThan(0);
      expect(quest.skillDimensions.length).toBeGreaterThan(0);
      expect(questTypes.has(quest.type)).toBe(true);

      for (const knowledgeNodeId of quest.knowledgeNodeIds) {
        expect(knowledgeNodeIds.has(knowledgeNodeId)).toBe(true);
      }

      for (const skillDimension of quest.skillDimensions) {
        expect(skillDimensions.has(skillDimension)).toBe(true);
      }
    }
  });

  it('covers every Async World knowledge node', () => {
    const coveredKnowledgeNodeIds = new Set(
      quests.flatMap((quest) => quest.knowledgeNodeIds),
    );

    expect([...coveredKnowledgeNodeIds].sort()).toEqual(
      [...knowledgeNodeIds].sort(),
    );
  });

  it('keeps quest progression linear and valid', () => {
    expect(quests.map((quest) => quest.id)).toEqual([
      'promise-basics',
      'promise-state',
      'promise-chain',
      'event-loop',
      'async-await-final',
      'race-condition',
    ]);

    for (let index = 1; index < quests.length; index += 1) {
      expect(quests[index].prerequisiteQuestIds).toEqual([quests[index - 1].id]);
    }
  });
});
