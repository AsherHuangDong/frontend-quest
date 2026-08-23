import type { ChapterDefinition, ChapterStatus } from './types';

export function getChapterStatus(
  chapter: ChapterDefinition,
  allChapters: ChapterDefinition[],
  clearedQuestIds: string[],
  clearedBossIds: string[],
): ChapterStatus {
  const prerequisitesCleared = chapter.prerequisiteChapterIds.every((id) => {
    const prerequisite = allChapters.find((item) => item.id === id);
    if (!prerequisite) return false;
    const questsCleared = prerequisite.questIds.every((questId) => clearedQuestIds.includes(questId));
    return questsCleared && (!prerequisite.bossId || clearedBossIds.includes(prerequisite.bossId));
  });

  if (!prerequisitesCleared) return 'LOCKED';

  const questsCleared = chapter.questIds.every((questId) => clearedQuestIds.includes(questId));
  if (questsCleared && (!chapter.bossId || clearedBossIds.includes(chapter.bossId))) return 'CLEARED';
  if (clearedQuestIds.some((questId) => chapter.questIds.includes(questId))) return 'IN_PROGRESS';
  return 'AVAILABLE';
}
