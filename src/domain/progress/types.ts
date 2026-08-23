import type { QuestStatus } from '../quest/types';

export interface QuestProgress {
  questId: string;
  status: QuestStatus;
  attempts: number;
  bestScore: number;
  lastScore: number | null;
  clearedAt: string | null;
}

export type ProgressMap = Record<string, QuestProgress>;
