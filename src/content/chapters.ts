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
    description: '从异步 JavaScript 开始，击败一只只知识小怪。',
    questIds: ['promise-basics', 'promise-chain'],
  },
];
