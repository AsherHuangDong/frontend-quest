/** Story scene domain — no React. */

export type ActorState = 'idle' | 'ready' | 'done' | 'blocked' | 'wrong';

export interface StoryActor {
  id: string;
  name: string;
  role: string;
  emoji: string;
  /** Label when this step has not completed correctly. */
  pendingLabel: string;
  /** Label when this step completed in a valid run. */
  doneLabel: string;
}

export interface StoryScene {
  id: string;
  place: string;
  title: string;
  /** Who the player is in one line. */
  identityLine: string;
  /** Opening pressure before the floor. */
  briefing: string;
  actors: StoryActor[];
  /** Correct process order (actor ids). */
  correctOrder: string[];
  /** Empty process line at start — player must choose. */
  chaosNarration: string;
  failNarration: string;
  /** Spoken by an NPC after a failed run. */
  failNpcLine: string;
  successNarration: string;
  successNpcLine: string;
  /** Repair log body (world archive, not a knowledge card). */
  repairLog: string;
  /** Hook to the next incident. */
  nextClue: string;
  nextPlace: string;
}

export interface SceneBoard {
  actorStates: Record<string, ActorState>;
  alarm: boolean;
  gateOpen: boolean;
}

export interface SceneRunResult {
  ok: boolean;
  board: SceneBoard;
}
