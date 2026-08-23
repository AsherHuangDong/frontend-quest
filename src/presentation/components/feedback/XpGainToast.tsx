export interface XpGainToastProps {
  amount: number;
  source?: string;
}

export function XpGainToast({ amount, source }: XpGainToastProps) {
  return (
    <div role="status">
      +{amount} XP{source ? ` · ${source}` : ''}
    </div>
  );
}
