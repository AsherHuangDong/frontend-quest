import type { Player } from '../../domain/player/types';
import type { ProgressMap } from '../../domain/progress/types';

export interface GameSave {
  version: 1;
  player: Player;
  progress: ProgressMap;
  gameplay: {
    currentStreak: number;
    bestStreak: number;
  };
}

export interface GameRepository {
  load(): GameSave | null;
  save(save: GameSave): void;
  clear(): void;
}
