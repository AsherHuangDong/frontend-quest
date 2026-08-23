export interface BossPhaseChangeProps {
  bossName: string;
  fromPhase: string | number;
  toPhase: string | number;
}

export function BossPhaseChange({ bossName, fromPhase, toPhase }: BossPhaseChangeProps) {
  return (
    <div className="feedback-card boss-phase-card" role="status">
      <div className="feedback-icon">🔥</div>
      <div>
        <strong>Boss Phase Changed</strong>
        <p>{bossName}</p>
        <span>Phase {fromPhase} → Phase {toPhase}</span>
      </div>
    </div>
  );
}
