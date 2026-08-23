import type { QuestCompletedEvent } from '../../application/events/questEvents';
import { feedbackStore } from './feedbackStore';

export function consumeQuestCompletedEvent(event: QuestCompletedEvent) {
  feedbackStore.pushToast({
    id: `xp-${event.questId}`,
    message: `+${event.rewards.xp} XP · ${event.questName}`,
  });

  feedbackStore.showModal({
    title: 'Quest Completed!',
    description: `${event.questName} completed. +${event.rewards.xp} XP gained.`,
  });
}
