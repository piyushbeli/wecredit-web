import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * URL Parameters Store State
 * Stores URL query parameters that persist throughout a session
 * Params are consumed (permanently removed) only after:
 * 1. Successful lead creation, OR
 * 2. User redirected to offers without filling form (dedupe returns existing offers)
 */
interface UrlParamsState {
  /** Partner code from URL (overrides default WC001) */
  partner: string | null;
  /** Origin sub-lender ID from URL */
  originSubLender: string | null;
  /** Whether URL params have been permanently consumed (no longer usable) */
  isConsumed: boolean;
}

/**
 * URL Parameters Store Actions
 */
interface UrlParamsActions {
  /** Set partner and originSubLender from URL (called once when URL is read) */
  setUrlParams: (partner: string | null, originSubLender: string | null) => void;
  /** Permanently consume params - called after successful lead creation or offers redirect */
  consumeParams: () => void;
  /** Clear all URL params (called on logout) */
  clearParams: () => void;
}

const initialState: UrlParamsState = {
  partner: null,
  originSubLender: null,
  isConsumed: false,
};

/**
 * Zustand store for managing URL query parameters
 * Used to pass partner code and originSubLender from URL to create-lead API
 * 
 * Session behavior:
 * - Params persist throughout the session (user can retry form multiple times)
 * - Params survive page refresh (stored in sessionStorage)
 * - Params are consumed permanently after successful lead creation OR offers redirect
 * - After consumption, default WC001 is used and originSubLender is removed
 */
export const useUrlParamsStore = create<UrlParamsState & UrlParamsActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUrlParams: (partner: string | null, originSubLender: string | null) => 
          set({ 
            partner, 
            originSubLender, 
            isConsumed: false 
          }, false, 'setUrlParams'),

        consumeParams: () => 
          set({ 
            partner: null, 
            originSubLender: null, 
            isConsumed: true 
          }, false, 'consumeParams'),

        clearParams: () => 
          set(initialState, false, 'clearParams'),
      }),
      {
        name: 'url-params-store',
        storage: {
          getItem: (name) => {
            const str = sessionStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          },
          setItem: (name, value) => {
            sessionStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            sessionStorage.removeItem(name);
          },
        },
      }
    ),
    {
      name: 'url-params-store',
    }
  )
);
