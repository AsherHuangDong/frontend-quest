import { feedbackStore } from '../store/feedbackStore';
import { useSyncExternalStore } from 'react';

export function useFeedback() {
  return useSyncExternalStore(
    feedbackStore.subscribe,
    feedbackStore.getState,
    feedbackStore.getState,
  );
}
