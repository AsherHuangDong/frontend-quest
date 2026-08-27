import type { Quest } from '../../domain/quest/types';
import type { ProgressMap } from '../../domain/progress/types';

/**
 * MVP adaptive selection:
 * Return the first quest that is not cleared and whose prerequisites are cleared.
 *
 * This intentionally stays rule-based. No scoring, ranking, or AI logic yet.
 */
export function getNextQuest(
  quests: Quest[],
  progress: ProgressMap,
): Quest | null {
  return quests.find((quest) => {
    const current = progress[quest.id];

    if (!current || current.status === 'cleared') {
      return false;
    }

    return quest.prerequisiteQuestIds.every(
      (id) => progress[id]?.status === 'cleared',
    );
  }) ?? null;
}
