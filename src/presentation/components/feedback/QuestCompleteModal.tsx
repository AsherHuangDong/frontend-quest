export interface QuestCompleteModalProps {
  questName?: string;
  title?: string;
  description?: string;
  rewards?: string[];
}

export function QuestCompleteModal({ questName, title, rewards = [] }: QuestCompleteModalProps) {
  return (
    <section role="dialog">
      <h2>Quest Completed!</h2>
      <p>{questName ?? title}</p>
      {rewards.length > 0 && (
        <ul>
          {rewards.map((reward) => <li key={reward}>{reward}</li>)}
        </ul>
      )}
    </section>
  );
}
