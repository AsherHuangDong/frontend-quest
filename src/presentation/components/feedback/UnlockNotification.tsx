export interface UnlockNotificationProps {
  title: string;
}

export function UnlockNotification({ title }: UnlockNotificationProps) {
  return (
    <div role="status">
      New Content Unlocked: {title}
    </div>
  );
}
