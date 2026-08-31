/** Relational minimal scene — types (Blind-1 + LEARNED = first Application Commit hit). */

export type SignalRole = 'progress' | 'noise' | 'ready';

export interface SignalDef {
  /** Instance-local id; must not reuse across discovery/application. */
  id: string;
  /** Neutral label — no ready/complete wording. */
  label: string;
  role: SignalRole;
  /** Appearance order within this instance (1-based for docs; 0-based in array order). */
  order: number;
}

export interface RelationalInstance {
  id: string;
  kind: 'discovery' | 'application';
  title: string;
  /** Thin pressure only. */
  brief: string;
  signals: SignalDef[];
}

export interface RunOutcome {
  pinnedSignalId: string;
  success: boolean;
  /** Empty or full at pin moment. */
  load: 'empty' | 'full';
  /** Which signal actually carries payload (ready). */
  readySignalId: string;
}

export interface LearnedState {
  /** True only if first Commit on a scoring application hit ready. */
  learned: boolean;
  /** First application commit succeeded. */
  firstAppCommitHit: boolean | null;
  /** Cleared by later search — not counted as LEARNED. */
  clearedBySearch: boolean;
}
