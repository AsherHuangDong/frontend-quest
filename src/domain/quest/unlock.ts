import type { Quest } from './types';
import type { ProgressMap } from '../progress/types';

export function canUnlockQuest(quest: Quest, progress: ProgressMap): boolean {
  return quest.prerequisiteQuestIds.every(
    (questId) => progress[questId]?.status === 'cleared',
  );
}
