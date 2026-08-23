export interface XpGainToastProps {
  amount?: number;
  message?: string;
  source?: string;
}

export function XpGainToast({ amount = 0, message, source }: XpGainToastProps) {
  return (
    <div className="feedback-toast xp-toast" role="status">
      <div className="feedback-icon">✨</div>
      <div className="feedback-content">
        <strong>{amount > 0 ? `+${amount} XP` : message}</strong>
        {source && <span>{source}</span>}
      </div>
    </div>
  );
}
