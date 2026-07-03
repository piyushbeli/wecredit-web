'use client';

/**
 * Once the lender is resolved and the user is authenticated, checks whether
 * this specific lender already has a status entry — if so, the caller should
 * skip the lead form and navigate straight to the offers page.
 */

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { checkStatusAll } from '@/lib/api';
import { hasMatchingStatusLender } from '@/lib/utils/common-helper';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';

interface UseLenderStatusRedirectParams {
  /** True once the active-lenders list has finished loading */
  isLenderResolved: boolean;
  canonicalLenderName: string | null;
  isAuthenticated: boolean;
}

interface UseLenderStatusRedirectReturn {
  isCheckingStatus: boolean;
  shouldNavigateToOffers: boolean;
}

async function lenderAlreadyHasStatus(
  mobile: string,
  token: string | undefined,
  canonicalLenderName: string
): Promise<boolean> {
  const result = await checkStatusAll(mobile, token);
  if (!result.success || !result.data) return false;
  return hasMatchingStatusLender(result.data.lenders ?? [], canonicalLenderName);
}

export function useLenderStatusRedirect({
  isLenderResolved,
  canonicalLenderName,
  isAuthenticated,
}: UseLenderStatusRedirectParams): UseLenderStatusRedirectReturn {
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [shouldNavigateToOffers, setShouldNavigateToOffers] = useState(false);

  useEffect(() => {
    if (!isLenderResolved) return;

    const mobileCookie = getCookie(STORAGE_MOBILE) as string | undefined;
    const canSkipToOffersCheck = canonicalLenderName && isAuthenticated && mobileCookie;

    if (!canSkipToOffersCheck) {
      setIsCheckingStatus(false);
      return;
    }

    let cancelled = false;
    setIsCheckingStatus(true);
    const token = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;

    lenderAlreadyHasStatus(mobileCookie, token, canonicalLenderName).then((matched) => {
      if (cancelled) return;
      setShouldNavigateToOffers(matched);
      setIsCheckingStatus(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isLenderResolved, canonicalLenderName, isAuthenticated]);

  return { isCheckingStatus, shouldNavigateToOffers };
}
