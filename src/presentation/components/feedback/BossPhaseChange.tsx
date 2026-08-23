export interface BossPhaseChangeProps {
  bossName: string;
  fromPhase: string;
  toPhase: string;
}

export function BossPhaseChange({ bossName, fromPhase, toPhase }: BossPhaseChangeProps) {
  return (
    <div role="status">
      {bossName}: {fromPhase} → {toPhase}
    </div>
  );
}
