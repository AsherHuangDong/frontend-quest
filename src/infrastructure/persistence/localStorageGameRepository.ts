import type { GameRepository, GameSave } from './gameRepository';

const STORAGE_KEY = 'frontend-quest:save';

export class LocalStorageGameRepository implements GameRepository {
  load(): GameSave | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as GameSave;
      if (parsed.version !== 1) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  save(save: GameSave): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
