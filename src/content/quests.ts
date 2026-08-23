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
    hints: [
      'Promise 描述的是一个未来才会得到结果的异步操作。',
      '它并不会让 JavaScript 变成多线程，而是让异步结果的成功、失败和等待状态更容易被组织。',
    ],
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
    description: '观察同步日志与微任务的执行顺序，击败第二只小怪。',
    difficulty: 2,
    prerequisiteQuestIds: ['promise-basics'],
    reward: { xp: 80 },
    hints: [
      '先执行当前同步代码，再处理 Promise.then 注册的微任务。',
      'console.log(3) 仍然属于当前同步任务，因此会在 then 回调之前执行。',
    ],
    challenge: {
      type: 'output',
      question: `执行下面代码，最终输出顺序是什么？\n\nconsole.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);`,
      options: [
        { id: 'A', label: '1 → 2 → 3' },
        { id: 'B', label: '1 → 3 → 2' },
        { id: 'C', label: '2 → 1 → 3' },
        { id: 'D', label: '3 → 1 → 2' },
      ],
      correctAnswer: 'B',
    },
  },
  {
    id: 'async-await-final',
    chapterId: 'javascript-basics',
    title: 'async / await 最终试炼',
    description: '综合判断 async / await 与 Promise 的执行关系。',
    difficulty: 3,
    prerequisiteQuestIds: ['promise-chain'],
    reward: { xp: 100 },
    hints: [
      'await 会暂停当前 async 函数的后续执行，但不会阻塞整个 JavaScript 主线程。',
      'await 后续代码会在 Promise settled 后以微任务的形式继续执行。',
    ],
    challenge: {
      type: 'choice',
      question: `下面代码最终输出顺序是什么？\n\nasync function run() {\n  console.log('A');\n  await Promise.resolve();\n  console.log('B');\n}\nrun();\nconsole.log('C');`,
      options: [
        { id: 'A', label: 'A → B → C' },
        { id: 'B', label: 'B → A → C' },
        { id: 'C', label: 'A → C → B' },
        { id: 'D', label: 'C → A → B' },
      ],
      correctAnswer: 'C',
    },
  },
];

export const firstQuest = quests[0];
