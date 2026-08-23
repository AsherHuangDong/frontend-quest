export interface XpGainToastProps {
  amount?: number;
  message?: string;
  source?: string;
}

export function XpGainToast({ amount = 0, message, source }: XpGainToastProps) {
  return (
    <div role="status">
      {amount > 0 ? `+${amount} XP` : message}
      {source ? ` · ${source}` : ''}
    </div>
  );
}
