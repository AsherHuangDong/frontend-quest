/** Shared player-facing copy for MVP hub / quest flow. */

export const UI = {
  productEyebrow: 'FRONTEND QUEST · 异步之城',
  worldTitle: '异步之城',
  volumeTitle: '第一卷《时序初章》',

  /** Always-visible orientation: what this place is + how to play */
  cityGuideTitle: '这里怎么玩？',
  cityGuideBody:
    '异步之城把 JavaScript 异步知识化成「城市异象」。你不是在答题，而是用操作修复错乱的时序，从而掌握真实规则。',
  cityGuideSteps: [
    {
      n: '1',
      title: '看当前异象',
      body: '每个异象对应一块前端知识。第 1 章练的是 Promise 链顺序（then 如何衔接）。',
    },
    {
      n: '2',
      title: '进入现场、重排步骤',
      body: '用上下箭头调整「契约誓约」顺序，点「唤起时序」看台账与库存是否恢复。',
    },
    {
      n: '3',
      title: '法则铭刻',
      body: '修复成功后，会明确写出对应的 Promise 规则，并记入你的能力证据。',
    },
  ] as const,

  onboardingTitle: '时序学徒入城',
  onboardingSteps: [
    { n: '1', title: '定级（可选）', body: '3 道题帮你找起点，不是考试，也不发 XP。' },
    { n: '2', title: '修复异象', body: '进入当前异象，用行动让城市状态回复。' },
    { n: '3', title: '法则铭刻', body: '每修复一处错乱，掌握一条时间法则。' },
  ] as const,

  learnTag: '本章要练的知识',
  learnTopic: 'Promise 链顺序（.then 衔接）',

  ctaCalibrate: '开始定级',
  ctaSkipCalibrate: '先跳过，直接进城',
  ctaNextQuest: '下一题',
  ctaStartRecommended: '按推荐开始',
  ctaRetry: '再试一次',
  ctaHint: '需要提示',
  ctaBackHub: '返回城中',
  ctaReview: '开始复习',
  ctaChallenge: '挑战',
  ctaReplay: '复习',
  ctaLocked: '未解锁',
  ctaFinishCalibrate: '完成定级',
  ctaCalibrateNext: '下一题',
  ctaEnterAnomaly: '进入金库现场',

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
  allClearHub: '返回城中看看进度',
} as const;
