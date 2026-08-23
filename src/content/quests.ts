import type { Quest } from '../domain/quest/types';

export const quests: Quest[] = [
  {
    id: 'promise-basics',
    chapterId: 'javascript-basics',
    title: 'Promise 到底解决了什么问题？',
    description: '先击败第一只小怪：理解 Promise 存在的核心价值。',
    difficulty: 1,
    prerequisiteQuestIds: [],
    reward: { xp: 50 },
    challenge: {
      type: 'choice',
      question: '在 JavaScript 中，Promise 最核心的作用是什么？',
      options: [
        { id: 'A', label: '让 JavaScript 代码变成多线程' },
        { id: 'B', label: '管理异步操作的状态与结果' },
        { id: 'C', label: '让所有函数自动变成异步函数' },
        { id: 'D', label: '提高 JavaScript 的 CPU 执行速度' },
      ],
      correctAnswer: 'B',
    },
  },
  {
    id: 'promise-chain',
    chapterId: 'javascript-basics',
    title: 'Promise 链式调用',
    description: '下一关即将开放：理解 then 如何把异步流程串起来。',
    difficulty: 2,
    prerequisiteQuestIds: ['promise-basics'],
    reward: { xp: 80 },
    challenge: {
      type: 'choice',
      question: 'Promise.then() 最重要的特性是什么？',
      options: [
        { id: 'A', label: '一定同步执行回调' },
        { id: 'B', label: '返回一个新的 Promise，可以继续形成链式流程' },
        { id: 'C', label: '阻塞主线程直到异步操作结束' },
        { id: 'D', label: '自动创建一个 Web Worker' },
      ],
      correctAnswer: 'B',
    },
  },
];

export const firstQuest = quests[0];
