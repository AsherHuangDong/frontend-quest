import type { StoryScene } from '../../domain/story/types';

/** Chapter 1 vertical slice — granary accident. Technical truth: promise chain order. */
export const granaryIncident: StoryScene = {
  id: 'story-granary-incident',
  place: '粮仓',
  title: '粮仓事故',
  identityLine: '你是时序城的修复者——被叫来处理第一起事故。',
  briefing:
    '粮仓响着警报。商人说钱交了，账房说册是空的，仓库不敢发货。你必须搞清这一单怎么走。',
  actors: [
    {
      id: 'merchant',
      name: '商人',
      role: '付款',
      emoji: '💰',
      pendingLabel: '等待付款',
      doneLabel: '已付款',
    },
    {
      id: 'clerk',
      name: '账房',
      role: '记账',
      emoji: '📒',
      pendingLabel: '账本未更新',
      doneLabel: '账本已记',
    },
    {
      id: 'keeper',
      name: '仓管',
      role: '出货',
      emoji: '📦',
      pendingLabel: '不敢发货',
      doneLabel: '货已出库',
    },
  ],
  correctOrder: ['merchant', 'clerk', 'keeper'],
  chaosNarration:
    '现场自动跑了一遍：钱到了，账本一动不动，仓门仍关着。',
  failNarration:
    '仓门狂响一声又绷住。有人动了，但这一单还是对不上。',
  failNpcLine:
    '账房：「货要是先走了，我拿什么记账？得先把付款和账理顺。」',
  successNarration:
    '钱入柜、账翻页、货出库。警报恢灭。商人松了口气。',
  successNpcLine: '仓管：「这回算是一单。谢谢。」',
  repairLog:
    '【粮仓修复记录】\n\n粮仓恢复运行。\n\n你理顺了一单货的办事顺序：\n必须等上一环完成，下一环才能开始。\n\n记录时间：刚刚',
  nextClue:
    '账房突然抬头：「等等…驿站刚传来的消息，好像也不对。」',
  nextPlace: '驿站',
};
