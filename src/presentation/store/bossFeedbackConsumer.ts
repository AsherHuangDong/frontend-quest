import type { BossClearedEvent, BossPhaseChangedEvent } from '../../application/events';
import { feedbackStore } from './feedbackStore';

export function consumeBossPhaseChangedEvent(event: BossPhaseChangedEvent) {
  feedbackStore.showNotification({
    title: 'Boss Phase Changed',
    content: `${event.previousPhase} → ${event.currentPhase}`,
  });
}

export function consumeBossClearedEvent(event: BossClearedEvent) {
  feedbackStore.showModal({
    title: 'Boss Defeated!',
    description: `Boss ${event.bossId} has been cleared.`,
  });
}
