export interface Chapter {
  id: string;
  title: string;
  description: string;
  questIds: string[];
}

export const chapters: Chapter[] = [
  {
    id: 'javascript-basics',
    title: 'Chapter 01 · JavaScript 基础',
    description: '从异步 JavaScript 开始，逐步理解 Promise、Microtask、Event Loop 与并发问题。',
    questIds: [
      'promise-basics',
      'promise-state',
      'promise-chain',
      'event-loop',
      'async-await-final',
      'race-condition',
    ],
  },
];
