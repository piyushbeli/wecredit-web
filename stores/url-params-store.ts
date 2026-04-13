import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

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
  /** Lender unique ID from URL — forwarded as `lenderUniqueId` header on create-lead */
  lenderUniqueId: string | null;
  /** UTM source attribution from URL */
  utm_source: string | null;
  /** UTM medium attribution from URL */
  utm_medium: string | null;
  /** UTM campaign attribution from URL */
  utm_campaign: string | null;
  /** Lender name attribution from URL */
  lendername: string | null;
  /** Full URL used for `utm_url` header (captures before we clean URL) */
  utm_url: string | null;
  /** Whether URL params have been permanently consumed (no longer usable) */
  isConsumed: boolean;
}

/**
 * URL Parameters Store Actions
 */
interface UrlParamsActions {
  /** Set partner, originSubLender, and lenderUniqueId from URL (called when URL is read) */
  setUrlParams: (
    partner: string | null,
    originSubLender: string | null,
    lenderUniqueId: string | null
  ) => void;
  /** Set marketing/affiliate attribution params from URL */
  setAttributionParams: (
    utm_url: string | null,
    utm_source: string | null,
    utm_medium: string | null,
    utm_campaign: string | null,
    lendername: string | null,
    lenderUniqueId: string | null
  ) => void;
  /** Permanently consume params - called after successful lead creation or offers redirect */
  /** Clear all URL params (called on logout) */
  clearParams: () => void;
}

const initialState: UrlParamsState = {
  partner: null,
  originSubLender: null,
  lenderUniqueId: null,
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  lendername: null,
  utm_url: null,
  isConsumed: false,
};

/**
 * Zustand store for managing URL query parameters
 * Used to pass partner code, originSubLender, and lenderUniqueId from URL to create-lead API
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

        setUrlParams: (
          partner: string | null,
          originSubLender: string | null,
          lenderUniqueId: string | null
        ) =>
          set(
            {
              partner,
              originSubLender,
              lenderUniqueId,
              isConsumed: false,
            },
            false,
            'setUrlParams'
          ),
        setAttributionParams: (
          utm_url: string | null,
          utm_source: string | null,
          utm_medium: string | null,
          utm_campaign: string | null,
          lendername: string | null,
          lenderUniqueId: string | null
        ) =>
          set(
            {
              utm_source,
              utm_medium,
              utm_campaign,
              lendername,
              lenderUniqueId,
              utm_url,
              isConsumed: false,
            },
            false,
            'setAttributionParams'
          ),
        clearParams: () => 
          set(initialState, false, 'clearParams'),
      }),
      {
        name: 'url-params-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: 'url-params-store',
    }
  )
);