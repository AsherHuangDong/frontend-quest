export interface SceneStatus {
  key: string;
  chaosLabel: string;
  stableLabel: string;
}

export interface SceneStep {
  id: string;
  label: string;
  /** Optional world inscription (may contain a technical hint). */
  inscription?: string;
}

export interface TimelineScene {
  id: string;
  place: string;
  title: string;
  /** Short entry: pressure + phenomenon only. */
  entry: string;
  /** After a failed run: what the world still looks like. */
  stillChaos: string;
  /** After success: world settles + handoff to next beat. */
  settled: string;
  statuses: SceneStatus[];
  steps: SceneStep[];
  correctOrder: string[];
  /** Designed first failure (common wrong belief). */
  initialOrder: string[];
}

export interface RunResult {
  ok: boolean;
  /** Per status key: stable or chaos. */
  board: Record<string, 'stable' | 'chaos'>;
}
