export interface BossCardProps {
  name: string;
  phase: string;
}

export function BossCard({ name, phase }: BossCardProps) {
  return (
    <section>
      <h2>{name}</h2>
      <p>Phase: {phase}</p>
    </section>
  );
}
