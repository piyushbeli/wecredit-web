import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

/**
 * Platform Store
 *
 * Tracks whether the app is being viewed inside a mobile platform context
 * (e.g. a mobile app webview that loads the web app with `?platform=mobile`).
 *
 * Persisted in sessionStorage so the flag survives:
 * - Internal navigations that drop the `platform` query param
 * - Page refreshes within the same tab
 *
 * It does NOT live in `url-params-store` because that store is cleared when
 * affiliate/UTM params disappear from the URL and on logout — both of which
 * would incorrectly wipe the platform flag.
 */
interface PlatformState {
  /** True when current session is in a mobile platform context (webview, etc.) */
  isMobilePlatform: boolean;
}

interface PlatformActions {
  /** Set whether the current session is a mobile platform context */
  setMobilePlatform: (isMobile: boolean) => void;
}

const initialState: PlatformState = {
  isMobilePlatform: false,
};

export const usePlatformStore = create<PlatformState & PlatformActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setMobilePlatform: (isMobile: boolean) =>
          set({ isMobilePlatform: isMobile }, false, 'setMobilePlatform'),
      }),
      {
        name: 'platform-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: 'platform-store',
    }
  )
);

/**
 * Convenience selector hook for components that only need the flag.
 * Keeps re-renders scoped to the boolean instead of the whole store.
 */
export const useIsMobilePlatform = (): boolean =>
  usePlatformStore((state) => state.isMobilePlatform);
