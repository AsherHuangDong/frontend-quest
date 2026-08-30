import type { AdventureChapter } from '../../domain/adventure/types';
import { evaluateChapterOrder } from '../../domain/adventure/evaluate';

/**
 * Chapter 2 — Microtask vs macrotask execution order.
 * Classic: sync → Promise.then (microtask) → setTimeout (macrotask).
 */
export const chapter2: AdventureChapter = {
  id: 'chapter-2-post-microdust',
  chapterNumber: 2,
  title: '驿站微尘乱序',
  knowledgeNodeIds: ['microtask'],
  learnTopic: '微任务 vs 宏任务（then / setTimeout）',
  rewardXp: 50,
  prerequisiteChapterIds: ['chapter-1-vault-contract'],

  intro: `异步之城 · 东门驿站

【你要学什么】
本关对应真实知识：微任务（microtask）与宏任务（macrotask）的执行顺序。

console.log('A')
Promise.resolve().then(() => console.log('B'))
setTimeout(() => console.log('C'), 0)
// 打印顺序：A → B → C
// then 进微任务队列；setTimeout 进宏任务队列。
// 当前同步代码跑完后，会先清完微任务，再轮到宏任务。

【故事现场】
驿站告示板乱了：城门铃已响，但「契约回响」与「驿鼓」抢着上板。
市民读到错的顺序，以为 setTimeout(0) 会比 Promise.then 更快。

【怎么玩】
1. 按「真实执行顺序」重排三张信件卡
2. 点「唤起时序」看告示板是否恢复
3. 错了重排；对了会铭刻微任务法则`,

  failNarration: `告示板闪了一下……驿鼓抢先敲响，契约回响才赶到。

这正是常见误区：setTimeout(fn, 0) 并不比 Promise.then 更早。
then 进微任务队列；当前同步码跑完后会先清微任务。
再排一次。`,

  successNarration: `告示板依次点亮：城门铃 → 契约回响 → 驿鼓。驿站恢复秩序。

法则铭刻：同步代码先跑完；然后清空微任务队列（Promise.then）；
最后才轮到宏任务（setTimeout）。

对应代码：
console.log('bell')
Promise.resolve().then(() => console.log('echo'))
setTimeout(() => console.log('drum'), 0)`,

  statusPanel: [
    {
      key: 'sync',
      failLabel: '城门铃 · 已响',
      successLabel: '城门铃 · 已响',
    },
    {
      key: 'micro',
      failLabel: '契约回响 · 还没到',
      successLabel: '契约回响 · 已回响',
    },
    {
      key: 'macro',
      failLabel: '驿鼓 · 抢先敲响',
      successLabel: '驿鼓 · 按时晚到',
    },
  ],

  actions: [
    { id: 'gateBell', label: '城门铃响', codeHint: "console.log('bell')" },
    { id: 'contractEcho', label: '契约回响', codeHint: 'Promise.then(...)' },
    { id: 'drumLate', label: '驿鼓晚到', codeHint: 'setTimeout(..., 0)' },
  ],

  correctOrder: ['gateBell', 'contractEcho', 'drumLate'],
  // Common wrong belief: setTimeout(0) runs before Promise.then
  initialOrder: ['gateBell', 'drumLate', 'contractEcho'],
};

export function evaluateChapter2(playerOrder: string[]) {
  return evaluateChapterOrder(
    playerOrder,
    chapter2.correctOrder,
    chapter2.statusPanel.map((s) => s.key),
  );
}
