export interface BossProgressBarProps {
  progress: number;
}

export function BossProgressBar({ progress }: BossProgressBarProps) {
  return <div>Progress: {progress}%</div>;
}
