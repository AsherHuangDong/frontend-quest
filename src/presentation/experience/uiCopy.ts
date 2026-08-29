/** Shared player-facing copy for MVP hub / quest flow. */

export const UI = {
  productEyebrow: 'FRONTEND QUEST · MVP',
  worldTitle: 'Async World',

  onboardingTitle: '三步开始',
  onboardingSteps: [
    { n: '1', title: '定级（可选）', body: '3 道题帮你找起点，不是考试，也不发 XP。' },
    { n: '2', title: '按推荐挑战', body: '点「下一题」即可；答错可看提示再试。' },
    { n: '3', title: '看见成长', body: 'XP、通关进度和能力掌握会留在本地。' },
  ] as const,

  ctaCalibrate: '开始定级',
  ctaSkipCalibrate: '先跳过，直接挑战',
  ctaNextQuest: '下一题',
  ctaStartRecommended: '按推荐开始',
  ctaRetry: '再试一次',
  ctaHint: '需要提示',
  ctaBackHub: '返回大厅',
  ctaReview: '开始复习',
  ctaChallenge: '挑战',
  ctaReplay: '复习',
  ctaLocked: '未解锁',
  ctaFinishCalibrate: '完成定级',
  ctaCalibrateNext: '下一题',

  statusCleared: '已通关',
  statusAvailable: '可挑战',
  statusLocked: '未解锁',

  calibrateChip: (i: number, total: number) =>
    `定级 ${i} / ${total} · 找起点，不是考试`,
  calibrateDoneTitle: (level: string) => `定级完成：${level}`,
  calibrateNoXpNote: '定级不发放 XP，也不改关卡解锁，只影响推荐路径。',

  reviewBannerTitle: (count: number) => `有 ${count} 个知识点适合复习了`,
  reviewBannerBody: (nodes: string) =>
    `不是进度倒退，只是记忆需要再加固：${nodes}`,

  noNextQuest: '暂时没有可推荐的下一题（可能已全部通关）',
  allClearHub: '返回大厅看看进度',
} as const;
