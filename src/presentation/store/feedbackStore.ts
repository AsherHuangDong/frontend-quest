export type FeedbackToast = {
  id: string;
  message: string;
  amount?: number;
};

export type FeedbackModal = {
  title: string;
  questName?: string;
  description?: string;
};

export type FeedbackNotification = {
  title: string;
  content: string;
};

export type BossPhaseFeedback = {
  bossName: string;
  fromPhase: number;
  toPhase: number;
};

export type FeedbackState = {
  toastQueue: FeedbackToast[];
  modal: FeedbackModal | null;
  notification: FeedbackNotification | null;
  bossPhase: BossPhaseFeedback | null;
};

const initialState: FeedbackState = {
  toastQueue: [],
  modal: null,
  notification: null,
  bossPhase: null,
};

let state = initialState;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const feedbackStore = {
  getState() {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  pushToast(toast: FeedbackToast) {
    state = {
      ...state,
      toastQueue: [...state.toastQueue, toast],
    };
    notify();
  },

  clearToast(id: string) {
    state = {
      ...state,
      toastQueue: state.toastQueue.filter((item) => item.id !== id),
    };
    notify();
  },

  showModal(modal: FeedbackModal) {
    state = {
      ...state,
      modal,
    };
    notify();
  },

  closeModal() {
    state = {
      ...state,
      modal: null,
    };
    notify();
  },

  showNotification(notification: FeedbackNotification) {
    state = {
      ...state,
      notification,
    };
    notify();
  },

  showBossPhase(phase: BossPhaseFeedback) {
    state = {
      ...state,
      bossPhase: phase,
    };
    notify();
  },

  clearNotification() {
    state = {
      ...state,
      notification: null,
    };
    notify();
  },
};
