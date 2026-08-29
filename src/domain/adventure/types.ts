export type AdventureStatusKey = 'payment' | 'ledger' | 'inventory';

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
  intro: string;
  failNarration: string;
  successNarration: string;
  statusPanel: AdventureStatusItem[];
  actions: AdventureAction[];
  correctOrder: string[];
  initialOrder: string[];
}

export interface AdventureEvaluationResult {
  success: boolean;
  status: Record<AdventureStatusKey, 'success' | 'fail'>;
}
