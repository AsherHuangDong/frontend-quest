import type { TimelineScene } from './types';

/** Internal map (never shown as lesson labels): A promise-chain, B micro/macro, C race. */

export const sceneA: TimelineScene = {
  id: 'granary',
  place: '粮仓',
  title: '账本与货物',
  entry: `库管和账房在叫。
银两已入柜，账本却没这一笔，货架上的袋子也还在。
一单货，三处对不上。`,
  stillChaos: `货走了一截，账房仍摇头：册上没有这一笔。
或者账先翻了，银柜却还没认。
顺序仍不对。`,
  settled: `银两入柜，账本翻页，货袋离架。库管呼了口气。

账房老头提了一句：东门今天也不对劲——门已落，令却还在跑。`,
  statuses: [
    { key: 'silver', chaosLabel: '银两 · 已入柜', stableLabel: '银两 · 已入柜' },
    { key: 'ledger', chaosLabel: '账本 · 未记这一笔', stableLabel: '账本 · 已记这一笔' },
    { key: 'goods', chaosLabel: '货架 · 货还在', stableLabel: '货架 · 货已出' },
  ],
  steps: [
    { id: 'collect', label: '确认收款', inscription: 'collect()' },
    { id: 'ledger', label: '翻开账本', inscription: '.then(ledger)' },
    { id: 'ship', label: '搬货出库', inscription: '.then(ship)' },
  ],
  correctOrder: ['collect', 'ledger', 'ship'],
  initialOrder: ['collect', 'ship', 'ledger'],
};

export const sceneB: TimelineScene = {
  id: 'gate',
  place: '东门',
  title: '落锁与信使',
  entry: `守卫指着门梢发呆。
门已落下，紧急令牌却还自己亮着；普通差事也搅在中间。
按规矩，落锁之后不应再执行新令。`,
  stillChaos: `门梢已扣死，令牌却又闪了一下。
守卫唔噼：明明是「稍后」的事，怎么还能插进来？`,
  settled: `落锁前该完的完了；落锁后，令牌不再自行亮起。
守卫重新站直。

信使队长蹭过来：南路与北路几乎同时改同一本库存册——册子上的数在跳。`,
  statuses: [
    { key: 'gate', chaosLabel: '城门 · 已落锁', stableLabel: '城门 · 已落锁' },
    { key: 'urgent', chaosLabel: '紧急令 · 不该亮时亮着', stableLabel: '紧急令 · 已在规程内处完' },
    { key: 'routine', chaosLabel: '普通差事 · 插队中', stableLabel: '普通差事 · 排在应在的位置' },
  ],
  steps: [
    { id: 'bolt', label: '扣上门梢', inscription: 'bolt()' },
    { id: 'urgent', label: '紧急令入队', inscription: 'queue.micro(urgent)' },
    { id: 'routine', label: '普通差事延后', inscription: 'setTimeout(routine)' },
  ],
  // sync-ish bolt framing + micro before macro: urgent before routine after bolt intent
  // Story: things that must finish in the "current batch" before delayed batch
  correctOrder: ['bolt', 'urgent', 'routine'],
  initialOrder: ['bolt', 'routine', 'urgent'],
};

export const sceneC: TimelineScene = {
  id: 'two-roads',
  place: '库房',
  title: '双路改册',
  entry: `同一货位，南路与北路几乎同时送上申报。
库存册上的数有时是南、有时是北。库管不敢发货。`,
  stillChaos: `册页又被改写一次，数字与刚才不一样。
谁先谁后一变，结果就变。`,
  settled: `南路先落笔，北路后落笔，然后封册。
连续两次，册上都是北路的数。库管点头，敢按册发货。

城卫队长在门口等你：以前总觉是人偷懒，现在看，是「事与事的先后」没理清。`,
  statuses: [
    { key: 'south', chaosLabel: '南路 · 已送出', stableLabel: '南路 · 已落笔' },
    { key: 'north', chaosLabel: '北路 · 已送出', stableLabel: '北路 · 已落笔（生效）' },
    { key: 'book', chaosLabel: '库存册 · 数字不稳', stableLabel: '库存册 · 已封，数字稳定' },
  ],
  steps: [
    { id: 'south', label: '南路落笔', inscription: 'write(south)' },
    { id: 'north', label: '北路落笔', inscription: 'write(north)' },
    { id: 'seal', label: '封册', inscription: 'seal()' },
  ],
  // Last write before seal wins: north last → north wins
  correctOrder: ['south', 'north', 'seal'],
  initialOrder: ['south', 'seal', 'north'],
};

export const volume1Scenes: TimelineScene[] = [sceneA, sceneB, sceneC];
