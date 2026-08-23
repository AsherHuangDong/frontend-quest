export type ChapterStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'CLEARED';

export interface ChapterDefinition {
  id: string;
  title: string;
  description: string;
  order: number;
  questIds: string[];
  bossId?: string;
  prerequisiteChapterIds: string[];
}

export interface ChapterProgress {
  chapterId: string;
  status: ChapterStatus;
}
