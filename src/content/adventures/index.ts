import type { AdventureChapter } from '../../domain/adventure/types';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';

export const adventureChapters: AdventureChapter[] = [chapter1, chapter2];

export function getChapter(id: string): AdventureChapter | undefined {
  return adventureChapters.find((c) => c.id === id);
}

export function isChapterUnlocked(
  chapter: AdventureChapter,
  progress: Record<string, { status?: string } | undefined>,
): boolean {
  return chapter.prerequisiteChapterIds.every(
    (id) => progress[id]?.status === 'cleared',
  );
}

export { chapter1, chapter2 };
