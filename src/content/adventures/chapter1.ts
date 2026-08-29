import type { AdventureChapter } from '../../domain/adventure/types';
import { evaluateChapterOrder } from '../../domain/adventure/evaluate';

export const chapter1: AdventureChapter = {
  id: 'chapter-1-vault-contract',
  chapterNumber: 1,
  title: '金库契约断裂',
  knowledgeNodeIds: ['promise'],

  intro: `异步之城 · 金库区

市民已将金币纳入「支付契约」，契约显示完成。
但台账未翻页，库房库存符文未熄——时间链在中途断了。

你是时序学徒。重排契约上的誓约顺序，再唤起时序，看城是否恢复。`,

  failNarration: `时序被唤起……支付之契亮起，台账仍沉睡。
链上有誓约站错了位置。再排一次。`,

  successNarration: `台账翻页，库房符文熄灭。金库重新顺从时间。

法则铭刻：Promise 链按 then 的衔接依次落下；
顺序错了，后面的誓约不会自动补上前面的结果。`,

  statusPanel: [
    {
      key: 'payment',
      failLabel: '支付契约 · 已完成',
      successLabel: '支付契约 · 已完成',
    },
    {
      key: 'ledger',
      failLabel: '订单台账 · 未翻页',
      successLabel: '订单台账 · 已记录',
    },
    {
      key: 'inventory',
      failLabel: '库存符文 · 仍亮着',
      successLabel: '库存符文 · 已扣减',
    },
  ],

  actions: [
    {
      id: 'payment',
      label: '确认支付',
      codeHint: 'payment',
    },
    {
      id: 'createOrder',
      label: '翻开台账',
      codeHint: 'createOrder',
    },
    {
      id: 'updateInventory',
      label: '熄灭库存符文',
      codeHint: 'updateInventory',
    },
  ],

  correctOrder: ['payment', 'createOrder', 'updateInventory'],
  initialOrder: ['payment', 'updateInventory', 'createOrder'],
};

/** Convenience export: evaluate this chapter's order */
export function evaluateChapter1(playerOrder: string[]) {
  return evaluateChapterOrder(playerOrder, chapter1.correctOrder);
}
