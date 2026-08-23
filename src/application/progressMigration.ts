import type { Quest } from '../domain/quest/types';
import type { ProgressMap } from '../domain/progress/types';

export function mergeQuestProgress(saved: ProgressMap, quests: Quest[]): ProgressMap {
  const defaults: ProgressMap = Object.fromEntries(
    quests.map((quest) => [
      quest.id,
      {
        questId: quest.id,
        status: quest.prerequisiteQuestIds.length === 0 ? 'available' : 'locked',
        attempts: 0,
        bestScore: 0,
        lastScore: null,
        clearedAt: null,
      },
    ]),
  );

  const merged: ProgressMap = Object.fromEntries(
    quests.map((quest) => [quest.id, saved[quest.id] ?? defaults[quest.id]]),
  );

  // Reconcile unlocks after a game update. A saved game may predate newly
  // added quests, so their initial `locked` state must be derived from the
  // already-cleared prerequisites rather than forcing the player to replay.
  let changed = true;
  while (changed) {
    changed = false;

    for (const quest of quests) {
      const current = merged[quest.id];
      if (!current || current.status !== 'locked') continue;

      const prerequisitesCleared = quest.prerequisiteQuestIds.every(
        (id) => merged[id]?.status === 'cleared',
      );

      if (prerequisitesCleared) {
        merged[quest.id] = { ...current, status: 'available' };
        changed = true;
      }
    }
  }

  return merged;
}
