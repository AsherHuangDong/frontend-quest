export interface QuestCardProps {
  title: string;
  status?: string;
}

export function QuestCard({ title, status }: QuestCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      {status && <span>{status}</span>}
    </article>
  );
}
