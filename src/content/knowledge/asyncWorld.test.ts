import { describe, expect, it } from 'vitest';
import { asyncKnowledgeNodes, asyncWorld } from './asyncWorld';

const nodeMap = new Map(asyncKnowledgeNodes.map((node) => [node.id, node]));

describe('Async World knowledge model', () => {
  it('defines the Async World', () => {
    expect(asyncWorld).toEqual({
      id: 'async-world',
      title: 'Async World',
      description: 'JavaScript 异步模型知识世界。',
    });
  });

  it('contains the six MVP knowledge nodes', () => {
    expect(asyncKnowledgeNodes.map((node) => node.id)).toEqual([
      'promise',
      'promise-state',
      'microtask',
      'event-loop',
      'async-await',
      'race-condition',
    ]);
  });

  it('assigns every node to the Async World', () => {
    expect(asyncKnowledgeNodes.every((node) => node.worldId === asyncWorld.id)).toBe(true);
  });

  it('defines the expected prerequisite relationships', () => {
    expect(nodeMap.get('promise')?.prerequisiteIds).toEqual([]);
    expect(nodeMap.get('promise-state')?.prerequisiteIds).toEqual(['promise']);
    expect(nodeMap.get('microtask')?.prerequisiteIds).toEqual(['promise']);
    expect(nodeMap.get('event-loop')?.prerequisiteIds).toEqual(['microtask']);
    expect(nodeMap.get('async-await')?.prerequisiteIds).toEqual(['promise', 'event-loop']);
    expect(nodeMap.get('race-condition')?.prerequisiteIds).toEqual([
      'microtask',
      'event-loop',
      'async-await',
    ]);
  });

  it('only references existing knowledge nodes as prerequisites', () => {
    for (const node of asyncKnowledgeNodes) {
      for (const prerequisiteId of node.prerequisiteIds) {
        expect(nodeMap.has(prerequisiteId)).toBe(true);
      }
    }
  });
});
