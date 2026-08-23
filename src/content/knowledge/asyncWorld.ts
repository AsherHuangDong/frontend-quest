import type { KnowledgeNode, World } from '../../domain/knowledge/types';

export const asyncWorld: World = {
  id: 'async-world',
  title: 'Async World',
  description: 'JavaScript 异步模型知识世界。',
};

export const asyncKnowledgeNodes: KnowledgeNode[] = [
  {
    id: 'promise',
    worldId: asyncWorld.id,
    title: 'Promise',
    description: '理解 Promise 表示的异步操作及其基本语义。',
    prerequisiteIds: [],
  },
  {
    id: 'promise-state',
    worldId: asyncWorld.id,
    title: 'Promise State',
    description: '理解 Promise 的 pending、fulfilled 与 rejected 状态。',
    prerequisiteIds: ['promise'],
  },
  {
    id: 'microtask',
    worldId: asyncWorld.id,
    title: 'Microtask',
    description: '理解 Promise 回调进入微任务队列以及微任务的执行时机。',
    prerequisiteIds: ['promise'],
  },
  {
    id: 'event-loop',
    worldId: asyncWorld.id,
    title: 'Event Loop',
    description: '理解 JavaScript 如何协调同步代码、任务与微任务的执行。',
    prerequisiteIds: ['microtask'],
  },
  {
    id: 'async-await',
    worldId: asyncWorld.id,
    title: 'async / await',
    description: '理解 async / await 与 Promise、事件循环之间的执行关系。',
    prerequisiteIds: ['promise', 'event-loop'],
  },
  {
    id: 'race-condition',
    worldId: asyncWorld.id,
    title: 'Race Condition',
    description: '理解异步操作之间因执行时序不同而产生的竞态问题。',
    prerequisiteIds: ['microtask', 'event-loop', 'async-await'],
  },
];
