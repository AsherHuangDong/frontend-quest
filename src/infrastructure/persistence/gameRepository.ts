import type { Player } from '../../domain/player/types';
import type { ProgressMap } from '../../domain/progress/types';
import type { BossProgress } from '../../domain/boss/types';

export interface GameSave {
  version: 1;
  player: Player;
  progress: ProgressMap;
  gameplay: {
    currentStreak: number;
    bestStreak: number;
    bossProgress?: BossProgress;
  };
}

export interface GameRepository {
  load(): GameSave | null;
  save(save: GameSave): void;
  clear(): void;
}
