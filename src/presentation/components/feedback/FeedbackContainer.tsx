import { useFeedback } from '../../hooks/useFeedback';
import { XpGainToast } from './XpGainToast';
import { QuestCompleteModal } from './QuestCompleteModal';
import { UnlockNotification } from './UnlockNotification';
import { BossPhaseChange } from './BossPhaseChange';

export function FeedbackContainer() {
  const feedback = useFeedback();

  return (
    <>
      {feedback.toastQueue.map((toast) => (
        <XpGainToast key={toast.id} {...toast} />
      ))}

      {feedback.modal && (
        <QuestCompleteModal {...feedback.modal} />
      )}

      {feedback.notification && (
        <UnlockNotification {...feedback.notification} />
      )}

      {feedback.bossPhase && (
        <BossPhaseChange {...feedback.bossPhase} />
      )}
    </>
  );
}
