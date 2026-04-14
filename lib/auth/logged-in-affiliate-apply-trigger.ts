import type { ReadonlyURLSearchParams } from 'next/navigation';
import { isAffiliateMnHubPath } from '@/lib/auth/affiliate-mn-flow';
import { isValidMobile } from '@/lib/utils/common-helper';

export type LoggedInAffiliateApplyTriggerResult = {
  shouldTrigger: boolean;
  delayMs: number;
};

/**
 * Logged-in (or re-hydrated) session: same UX as post-OTP `open_personal_loan_apply` —
 * open dedupe / lead pipeline when landing on PL hub with affiliate params.
 * Pure decision + delay so the caller can set the dedupe ref and schedule `triggerApplyFlow`.
 */
export const getLoggedInAffiliateApplyTrigger = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams | null,
  sessionMobile: string,
  normalizeParam: (value: string | null) => string | null,
  partnerApplyModalAlreadyOpened: boolean,
  wasUnauthenticated: boolean
): LoggedInAffiliateApplyTriggerResult => {
  const partnerParam = normalizeParam(searchParams?.get('partner') ?? null);
  const lenderParam = normalizeParam(
    (searchParams?.get('lendername') ??
      searchParams?.get('lender_name') ??
      searchParams?.get('lenderName')) ??
      null
  );
  const mnParam = searchParams?.get('mn') ?? null;
  const mobileTrimmed = sessionMobile.trim();
  const mnMatchesSession =
    isValidMobile(mnParam) && mnParam.trim() === mobileTrimmed;

  const shouldTrigger =
    isAffiliateMnHubPath(pathname) &&
    !partnerApplyModalAlreadyOpened &&
    !searchParams?.get('pre_auth') &&
    (Boolean(partnerParam) || Boolean(lenderParam) || mnMatchesSession);

  // If we just called setUser, wait for Zustand + children to see authenticated state.
  const delayMs = wasUnauthenticated ? 100 : 0;

  return { shouldTrigger, delayMs };
};
