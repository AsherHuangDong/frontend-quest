export type FeedbackToast = {
  id: string;
  message: string;
};

export type FeedbackModal = {
  title: string;
  description?: string;
};

export type FeedbackState = {
  toastQueue: FeedbackToast[];
  modal: FeedbackModal | null;
  notification: string | null;
};

const initialState: FeedbackState = {
  toastQueue: [],
  modal: null,
  notification: null,
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

  showNotification(message: string) {
    state = {
      ...state,
      notification: message,
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