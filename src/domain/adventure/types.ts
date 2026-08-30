/** Free-form status panel keys (per chapter). */
export type AdventureStatusKey = string;

export interface AdventureStatusItem {
  key: AdventureStatusKey;
  failLabel: string;
  successLabel: string;
}

export interface AdventureAction {
  id: string;
  label: string;
  codeHint: string;
}

export interface AdventureChapter {
  id: string;
  chapterNumber: number;
  title: string;
  knowledgeNodeIds: string[];
  /** Short label for Hub, e.g. "Promise 链顺序" */
  learnTopic: string;
  intro: string;
  failNarration: string;
  successNarration: string;
  statusPanel: AdventureStatusItem[];
  actions: AdventureAction[];
  correctOrder: string[];
  initialOrder: string[];
  /** XP on first clear */
  rewardXp: number;
  /** Chapter ids that must be cleared before this one unlocks */
  prerequisiteChapterIds: string[];
}

export interface AdventureEvaluationResult {
  success: boolean;
  status: Record<string, 'success' | 'fail'>;
}
