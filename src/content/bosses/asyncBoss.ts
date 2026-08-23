import type { BossDefinition } from '../../domain/boss/types';

export const asyncBoss: BossDefinition = {
  id: 'async-boss',
  title: '异步之王',
  description: '证明你真正理解 Promise、Microtask 与 async/await。',
  chapterId: 'javascript-basics',
  rewardXp: 150,
  phases: [
    {
      id: 'promise-phase',
      title: 'Phase 1 · Promise',
      questIds: ['quest-01'],
      requiredScore: 80,
    },
    {
      id: 'event-loop-phase',
      title: 'Phase 2 · Event Loop',
      questIds: ['quest-02'],
      requiredScore: 80,
    },
    {
      id: 'async-final-phase',
      title: 'Phase 3 · Final Trial',
      questIds: ['quest-03'],
      requiredScore: 80,
    },
  ],
};
