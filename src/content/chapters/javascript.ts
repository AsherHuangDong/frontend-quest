import type { ChapterDefinition } from '../../domain/chapter/types';

export const javascriptChapter: ChapterDefinition = {
  id: 'javascript-basics',
  title: 'JavaScript 核心',
  description: '从语言基础到异步模型，完成你的第一张前端知识地图。',
  order: 1,
  questIds: ['quest-01', 'quest-02', 'quest-03'],
  bossId: 'async-boss',
  prerequisiteChapterIds: [],
};
