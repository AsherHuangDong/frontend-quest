type EmptyStateProps = {
  message?: string;
};

export function EmptyState({ message = "No data" }: EmptyStateProps) {
  return <div>{message}</div>;
}
