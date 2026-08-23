export interface QuestCompleteModalProps {
  questName?: string;
  title?: string;
  description?: string;
  rewards?: string[];
}

export function QuestCompleteModal({ questName, title, description, rewards = [] }: QuestCompleteModalProps) {
  return (
    <div className="feedback-overlay">
      <section className="feedback-modal quest-complete-modal" role="dialog">
        <h2>🎉 Quest Completed!</h2>
        <h3>{questName ?? title}</h3>
        {description && <p>{description}</p>}
        {rewards.length > 0 && (
          <ul className="reward-list">
            {rewards.map((reward) => <li key={reward}>{reward}</li>)}
          </ul>
        )}
        <button type="button">Continue</button>
      </section>
    </div>
  );
}
