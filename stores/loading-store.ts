import { create } from 'zustand';

/**
 * Loading state interface
 */
interface LoadingState {
  /** Whether the loading screen is visible */
  isVisible: boolean;
  /** Primary message to display */
  message: string;
  /** Secondary message to display */
  subtext: string;
}

/**
 * Loading actions interface
 */
interface LoadingActions {
  /**
   * Show the loading screen with optional custom messages
   * @param options.message Primary message
   * @param options.subtext Secondary message
   */
  show: (options?: { message?: string; subtext?: string }) => void;
  /** Hide the loading screen */
  hide: () => void;
}

/** Default messages */
const DEFAULT_MESSAGE = 'Please wait...';
const DEFAULT_SUBTEXT = "We're preparing your WeCredit experience.";

/**
 * Zustand store for global loading state
 */
export const useLoadingStore = create<LoadingState & LoadingActions>((set) => ({
  isVisible: false,
  message: DEFAULT_MESSAGE,
  subtext: DEFAULT_SUBTEXT,

  show: (options) =>
    set({
      isVisible: true,
      message: options?.message ?? DEFAULT_MESSAGE,
      subtext: options?.subtext ?? DEFAULT_SUBTEXT,
    }),

  hide: () =>
    set({
      isVisible: false,
    }),
}));
