type ErrorStateProps = {
  message: string;
  retry?: () => void;
};

export function ErrorState({ message, retry }: ErrorStateProps) {
  return (
    <div role="alert">
      <span>{message}</span>
      {retry && <button onClick={retry}>Retry</button>}
    </div>
  );
}
