import type { RelationalInstance } from './types';

/** Discovery: stable order, three signals. Sweep allowed; does not set LEARNED. */
export const discoveryInstance: RelationalInstance = {
  id: 'discovery-d',
  kind: 'discovery',
  title: '流水线取样',
  brief: '下游需要上游的有效载荷。上游会依次给出三种信号——你只能选定一种时机去取用。',
  signals: [
    { id: 'D1', label: '信号·甲', role: 'progress', order: 1 },
    { id: 'D2', label: '信号·乙', role: 'progress', order: 2 },
    { id: 'D3', label: '信号·丙', role: 'ready', order: 3 },
  ],
};

/**
 * Application shuffle pool — ready at different ordinals.
 * IDs disjoint from discovery. Labels neutral.
 */
export const applicationPool: RelationalInstance[] = [
  {
    id: 'app-a1',
    kind: 'application',
    title: '异地复核',
    brief: '另一条线：四种信号，顺序与名称都不同。第一次取用会计入是否掌握关系。',
    signals: [
      { id: 'A1_p', label: '脉冲·北', role: 'noise', order: 1 },
      { id: 'A1_q', label: '脉冲·东', role: 'ready', order: 2 },
      { id: 'A1_r', label: '脉冲·南', role: 'progress', order: 3 },
      { id: 'A1_s', label: '脉冲·西', role: 'progress', order: 4 },
    ],
  },
  {
    id: 'app-a2',
    kind: 'application',
    title: '异地复核',
    brief: '另一条线：四种信号，顺序与名称都不同。第一次取用会计入是否掌握关系。',
    signals: [
      { id: 'A2_w', label: '节点·霜', role: 'progress', order: 1 },
      { id: 'A2_x', label: '节点·露', role: 'noise', order: 2 },
      { id: 'A2_y', label: '节点·雾', role: 'progress', order: 3 },
      { id: 'A2_z', label: '节点·虹', role: 'ready', order: 4 },
    ],
  },
  {
    id: 'app-a3',
    kind: 'application',
    title: '异地复核',
    brief: '另一条线：四种信号，顺序与名称都不同。第一次取用会计入是否掌握关系。',
    signals: [
      { id: 'A3_m', label: '波次·一', role: 'ready', order: 1 },
      { id: 'A3_n', label: '波次·二', role: 'noise', order: 2 },
      { id: 'A3_o', label: '波次·三', role: 'progress', order: 3 },
      { id: 'A3_p', label: '波次·四', role: 'progress', order: 4 },
    ],
  },
];

export function pickApplication(seed?: number): RelationalInstance {
  const i =
    seed !== undefined
      ? Math.abs(seed) % applicationPool.length
      : Math.floor(Math.random() * applicationPool.length);
  return applicationPool[i]!;
}

export function readySignal(instance: RelationalInstance) {
  const r = instance.signals.find((s) => s.role === 'ready');
  if (!r) throw new Error(`No ready signal in ${instance.id}`);
  return r;
}
