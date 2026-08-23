export interface QuestCompleteModalProps {
  questName: string;
  rewards?: string[];
}

export function QuestCompleteModal({ questName, rewards = [] }: QuestCompleteModalProps) {
  return (
    <section role="dialog">
      <h2>Quest Completed!</h2>
      <p>{questName}</p>
      {rewards.length > 0 && (
        <ul>
          {rewards.map((reward) => <li key={reward}>{reward}</li>)}
        </ul>
      )}
    </section>
  );
}
