import { getCookie } from 'cookies-next';
import { clearAuthData } from '@/lib/api';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { isValidMobile } from '@/lib/utils/common-helper';
import type { PendingAction } from '@/stores/auth-store';

/**
 * Routes where affiliate `?mn=` deep links open the OTP-first modal and optionally
 * take over an existing session (different mobile). Sub-routes like `/personal-loan/lender/...`
 * intentionally use their own flows (e.g. campaign landing).
 */
const AFFILIATE_MN_HUB_PATHS = new Set<string>(['/', '/personal-loan']);

function normalizePath(pathname: string | null): string {
  return (pathname || '/').replace(/\/$/, '') || '/';
}

/**
 * Hub routes where `PersonalLoanContent` is mounted (`/` and `/personal-loan`).
 * Shared by affiliate `?mn=` flow and partner/lender attribution auto-apply.
 */
export function isAffiliateMnHubPath(pathname: string | null): boolean {
  return AFFILIATE_MN_HUB_PATHS.has(normalizePath(pathname));
}

/**
 * Dependencies injected from AuthProvider (hooks / store). Keeps this module free of React
 * so it stays easy to test and extend (e.g. extra hub routes or actions).
 */
export interface AffiliateMnFlowActions {
  logout: () => void;
  /** Re-sync partner/UTM after `logout()` clears the url-params store. */
  captureAttributionFromUrl: (options?: { cleanUrl?: boolean }) => void;
  openModalWithPendingActionAtOtp: (
    action: PendingAction,
    phoneNumber: string
  ) => void;
  setAuthInitialized: (initialized: boolean) => void;
}

/**
 * Affiliate deep link: `?mn=<valid mobile>` without `pre_auth` on the PL hub (`/` or `/personal-loan`).
 *
 * - **No session cookies:** open OTP modal (same as legacy unauthenticated affiliate flow).
 * - **Session with different mobile than `mn`:** clear auth, re-capture URL attribution, then OTP.
 * - **Session with same mobile as `mn`:** do nothing here; caller continues to `validateToken`.
 *
 * @returns `true` if this helper fully handled init (caller should return early from `initializeAuth`).
 */
export function runAffiliateMnFlow(
  pathname: string | null,
  searchParams: Pick<URLSearchParams, 'get'> | null | undefined,
  mnAffiliateOtpOpenedRef: { current: boolean },
  actions: AffiliateMnFlowActions
): boolean {
  const mnParam = searchParams?.get('mn') ?? null;
  const hasAffiliateMn =
    isAffiliateMnHubPath(pathname) &&
    !searchParams?.get('pre_auth') &&
    isValidMobile(mnParam) &&
    !mnAffiliateOtpOpenedRef.current;

  if (!hasAffiliateMn) {
    return false;
  }

  const token = getCookie(STORAGE_AUTH_TOKEN);
  const mobile = getCookie(STORAGE_MOBILE);
  const mnTrimmed = mnParam?.trim() ?? '';

  if (token && mobile) {
    const mobileTrimmed = mobile.toString().trim();

    if (mobileTrimmed !== mnTrimmed) {
      clearAuthData();
      actions.logout();
      actions.captureAttributionFromUrl({ cleanUrl: false });

      mnAffiliateOtpOpenedRef.current = true;
      actions.openModalWithPendingActionAtOtp(
        { type: 'open_personal_loan_apply' },
        mnTrimmed
      );
      actions.setAuthInitialized(true);
      return true;
    }

    return false;
  }

  mnAffiliateOtpOpenedRef.current = true;
  actions.openModalWithPendingActionAtOtp(
    { type: 'open_personal_loan_apply' },
    mnTrimmed
  );
  actions.setAuthInitialized(true);
  return true;
}
