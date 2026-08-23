export interface BossPhaseChangeProps {
  bossName: string;
  fromPhase: string | number;
  toPhase: string | number;
}

export function BossPhaseChange({ bossName, fromPhase, toPhase }: BossPhaseChangeProps) {
  return (
    <div role="status">
      {bossName}: {fromPhase} → {toPhase}
    </div>
  );
}
