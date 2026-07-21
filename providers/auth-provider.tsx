'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { authService, clearAuthData, setAuthToken, setMobile } from '@/lib/api';
import { getCookie, deleteCookie } from 'cookies-next';
import { AUTH_COOKIE_OPTIONS, STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { isAffiliateMnHubPath, runAffiliateMnFlow } from '@/lib/auth/affiliate-mn-flow';
import { getLoggedInAffiliateApplyTrigger } from '@/lib/auth/logged-in-affiliate-apply-trigger';
import {
  buildOffersRedirectPath,
  extractMobileFromPreAuthToken,
  normalizeMnQueryParam,
  removePreAuthFromUrl,
} from '@/lib/auth/pre-auth-token';
import { useAuthCookieSync } from '@/hooks/use-auth-cookie-sync';

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

type PreAuthHandleResult = 'applied' | 'skipped' | 'failed';

/**
 * AuthProvider Component
 * Validates existing auth token on app mount and syncs auth state with backend.
 * Supports affiliate pre-auth via URL `pre_auth` (mobile from JWT `phoneNumber` claim or `mn` query).
 * Also handles partner and originSubLender URL params for lead creation.
 *
 * Pre-auth tokens are stored as the app auth token and confirmed via GET /api/auth?endpoint=validate
 * (no separate exchange endpoint in this codebase).
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const hasInitialized = useRef(false);
  const preAuthPromiseRef = useRef<Promise<PreAuthHandleResult> | null>(null);
  const mnAffiliateOtpOpenedRef = useRef(false);
  /**
   * Prevents double-opening apply (guest modal or logged-in triggerApplyFlow) when affiliate
   * query is present (Strict Mode / retries).
   */
  const partnerLenderApplyModalOpenedRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Stable dependency for effects: `searchParams` object identity may not change on SPA navigation.
  const searchParamsString = searchParams?.toString() ?? '';
  const {
    isAuthenticated,
    logout,
    setLoading,
    setUser,
    setAuthInitialized,
    openModalWithPendingActionAtOtp,
    openModalWithPendingAction,
  } = useAuthStore();

  // Keep auth state (localStorage) in sync with cookies
  useAuthCookieSync();
  const { setUrlParams, setAttributionParams, clearParams } = useUrlParamsStore();
  const { triggerApplyFlow } = useLoanApplicationStore();

  /**
   * Normalizes query params into either a trimmed non-empty string or `null`.
   * This prevents sending empty header values (e.g. `utm_medium=`) to the backend.
   */
  const normalizeParam = useCallback((value: string | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, []);

  /**
   * Captures partner + marketing attribution params from URL into the session store.
   * Called for both pre-auth links and regular landing flows.
   */
  const captureAttributionFromUrl = useCallback(
    (options?: { cleanUrl?: boolean }): void => {
      const partner = normalizeParam(searchParams?.get('partner'));
      const originSubLender = normalizeParam(searchParams?.get('originSubLender'));
      const lenderUniqueId = normalizeParam(
        searchParams?.get('lenderUniqueId') ?? searchParams?.get('lenderUniqueId') ?? searchParams?.get('lenderuniqueid')
      );

      const utm_source = normalizeParam(searchParams?.get('utm_source'));
      const utm_medium = normalizeParam(searchParams?.get('utm_medium'));
      const utm_campaign = normalizeParam(searchParams?.get('utm_campaign'));
      // Affiliates may use `lendername`, `lender_name`, or `lenderName`; store one canonical value.
      const lendername = normalizeParam(
        searchParams?.get('lendername') ??
          searchParams?.get('lender_name') ??
          searchParams?.get('lenderName') 
      );

      // If the visible URL has no affiliate/UTM params, reset the persisted session store so
      // `getEffectivePartnerCode()` returns WC001 and headers stay aligned with the URL after
      // SPA navigations (e.g. Link to `/` strips `?partner=` but sessionStorage would otherwise
      // keep the old code).
      const hasAnyParams =
        partner ||
        originSubLender ||
        lenderUniqueId ||
        utm_source ||
        utm_medium ||
        utm_campaign ||
        lendername;

      if (!hasAnyParams) {
        clearParams();
        return;
      }

      const hasAttribution = Boolean(utm_source || utm_medium || utm_campaign || lendername);
      const utm_url =
        hasAttribution && typeof window !== 'undefined' ? window.location.href : null;

      // When this URL includes relevant params, sync the store; explicit nulls for missing
      // fields prevent stale affiliate/UTM values from a previous landing with params.
      setUrlParams(partner ?? null, originSubLender ?? null, lenderUniqueId ?? null);
      setAttributionParams(utm_url, utm_source, utm_medium, utm_campaign, lendername, lenderUniqueId);

      if (options?.cleanUrl && typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('partner');
        url.searchParams.delete('originSubLender');
        url.searchParams.delete('utm_source');
        url.searchParams.delete('utm_medium');
        url.searchParams.delete('utm_campaign');
        url.searchParams.delete('lendername');
        url.searchParams.delete('lender_name');
        url.searchParams.delete('lenderName');
        url.searchParams.delete('lenderUniqueId');
        window.history.replaceState({}, '', url.toString());
      }
    },
    [clearParams, normalizeParam, searchParams, setAttributionParams, setUrlParams]
  );
  /**
   * Affiliate pre-auth: read `pre_auth`, resolve mobile from `mn` or JWT `phoneNumber`,
   * validate via backend, then redirect to /offers.
   */
  const handlePreAuth = useCallback(async (): Promise<PreAuthHandleResult> => {
    const preAuth = normalizeParam(searchParams?.get('pre_auth'));
    if (!preAuth) {
      return 'skipped';
    }
    if (preAuthPromiseRef.current) {
      return preAuthPromiseRef.current;
    }

    const runPreAuth = async (): Promise<PreAuthHandleResult> => {
      captureAttributionFromUrl({ cleanUrl: false });

      const phoneFromQuery = normalizeMnQueryParam(searchParams?.get('mn'));
      const phoneFromToken = extractMobileFromPreAuthToken(preAuth);
      const resolvedPhoneNumber = phoneFromQuery ?? phoneFromToken;

      if (typeof window !== 'undefined') {
        const storedPreAuth = sessionStorage.getItem('pre_auth_token');
        if (storedPreAuth === preAuth) {
          removePreAuthFromUrl();
          const existingToken = getCookie(STORAGE_AUTH_TOKEN);
          const existingMobile = getCookie(STORAGE_MOBILE);
          if (existingToken && existingMobile) {
            if (!isAuthenticated) {
              setUser(
                {
                  id: `user-${existingMobile}`,
                  phoneNumber: existingMobile.toString(),
                  name: `User ${existingMobile.toString().slice(-4)}`,
                },
                existingToken.toString()
              );
            }
            if (!pathname.startsWith('/offers')) {
              router.replace(buildOffersRedirectPath(searchParamsString));
            }
            return 'applied';
          }
        }
      }

      if (!resolvedPhoneNumber) {
        removePreAuthFromUrl();
        return 'failed';
      }

      setLoading(true);
      try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pre_auth_handled', '1');
        sessionStorage.setItem('pre_auth_token', preAuth);
        sessionStorage.setItem('pre_auth_mobile', resolvedPhoneNumber);
      }

      // Skip duplicate validate when Strict Mode / remount replays the same pre_auth token.
      const validateDedupeKey = `pre_auth_validated:${preAuth}`;
      if (typeof window !== 'undefined' && sessionStorage.getItem(validateDedupeKey) === '1') {
        const existingToken = getCookie(STORAGE_AUTH_TOKEN);
        const existingMobile = getCookie(STORAGE_MOBILE);
        if (existingToken && existingMobile) {
          setUser(
            {
              id: `user-${resolvedPhoneNumber}`,
              phoneNumber: resolvedPhoneNumber,
              name: `User ${resolvedPhoneNumber.slice(-4)}`,
            },
            preAuth
          );
          removePreAuthFromUrl();
          if (!pathname.startsWith('/offers')) {
            router.replace(buildOffersRedirectPath(searchParamsString));
          }
          return 'applied';
        }
      }

      deleteCookie(STORAGE_AUTH_TOKEN, { path: AUTH_COOKIE_OPTIONS.path });
        deleteCookie(STORAGE_MOBILE, { path: AUTH_COOKIE_OPTIONS.path });
        setAuthToken(preAuth);
        setMobile(resolvedPhoneNumber);

        // Pass credentials explicitly so validate does not rely on cookie read timing.
        const result = await authService.validateToken({
          token: preAuth,
          mobile: resolvedPhoneNumber,
        });
        if (!result.isValid) {
          clearAuthData();
          removePreAuthFromUrl();
          return 'failed';
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`pre_auth_validated:${preAuth}`, '1');
        }

        setUser(
          {
            id: `user-${resolvedPhoneNumber}`,
            phoneNumber: resolvedPhoneNumber,
            name: `User ${resolvedPhoneNumber.slice(-4)}`,
          },
          preAuth
        );
        removePreAuthFromUrl();
        router.replace(buildOffersRedirectPath(searchParamsString));
        return 'applied';
      } catch {
        clearAuthData();
        removePreAuthFromUrl();
        return 'failed';
      } finally {
        setLoading(false);
      }
    };

    preAuthPromiseRef.current = runPreAuth();
    try {
      return await preAuthPromiseRef.current;
    } finally {
      preAuthPromiseRef.current = null;
    }
  }, [
    captureAttributionFromUrl,
    isAuthenticated,
    normalizeParam,
    pathname,
    router,
    searchParams,
    searchParamsString,
    setLoading,
    setUser,
  ]);

  /**
   * Validates the existing auth token on app mount
   * Called once on initial render if user appears to be authenticated
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    const preAuthResult = await handlePreAuth();
    if (preAuthResult === 'applied') {
      setAuthInitialized(true);
      return;
    }

    // Capture attribution params for regular landing flows as well.
    // This makes campaign URLs work even when `pre_auth` is not present.
    captureAttributionFromUrl({ cleanUrl: false });

    // Affiliate `mn` hub flow (see `runAffiliateMnFlow` in lib/auth).
    const affiliateHandled = runAffiliateMnFlow(
      pathname,
      searchParams,
      mnAffiliateOtpOpenedRef,
      {
        logout,
        captureAttributionFromUrl,
        openModalWithPendingActionAtOtp,
        setAuthInitialized,
      }
    );
    if (affiliateHandled) {
      return;
    }

    // Check if token exists in cookies
    const token = getCookie(STORAGE_AUTH_TOKEN);
    const mobile = getCookie(STORAGE_MOBILE);
    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (!token || !mobile) {
      // No token in cookies - ensure clean logout state
      if (isAuthenticated) {
        // Preserve in-memory session while offline; cookie re-check can recover after connectivity returns.
        if (isOffline) {
          setAuthInitialized(true);
          return;
        }
        logout();
        // `logout()` clears url-params store; re-sync from URL so attribution survives for lead APIs.
        captureAttributionFromUrl({ cleanUrl: false });
      }

      // Partner / lender in URL on PL hub: same post-login pipeline as affiliate `?mn=` (apply → dedupe → lead form).
      const partnerParam = normalizeParam(searchParams?.get('partner'));
      const lenderParam = normalizeParam(
        searchParams?.get('lendername') ??
          searchParams?.get('lender_name') ??
          searchParams?.get('lenderName')
      );
      if (
        isAffiliateMnHubPath(pathname) &&
        !partnerLenderApplyModalOpenedRef.current &&
        (partnerParam || lenderParam)
      ) {
        partnerLenderApplyModalOpenedRef.current = true;
        openModalWithPendingAction({ type: 'open_personal_loan_apply' });
      }

      setAuthInitialized(true);
      return;
    }
    // Token exists - validate with backend
    setLoading(true);
    try {
      const result = await authService.validateToken();
      if (!result.isValid) {
        // Only force logout when backend explicitly marks token invalid.
        // For network/unknown failures, keep session to avoid false logouts on poor connectivity.
        if (result.failureReason !== 'invalid_token') {
          setAuthInitialized(true);
          return;
        }
        logout();
      } else {
        const wasUnauthenticated = !isAuthenticated;

        if (!isAuthenticated) {
          setUser(
            {
              id: `user-${mobile}`,
              phoneNumber: mobile.toString(),
              name: `User ${mobile.toString().slice(-4)}`,
            },
            token.toString()
          );
        }

        const { shouldTrigger, delayMs } = getLoggedInAffiliateApplyTrigger(
          pathname,
          searchParams,
          mobile.toString(),
          normalizeParam,
          partnerLenderApplyModalOpenedRef.current,
          wasUnauthenticated
        );

        if (shouldTrigger) {
          partnerLenderApplyModalOpenedRef.current = true;
          setTimeout(() => {
            triggerApplyFlow();
          }, delayMs);
        }
      }
    } catch {
      // Runtime/network edge cases should not force logout; user can continue/retry.
      setAuthInitialized(true);
    } finally {
      setLoading(false);
      setAuthInitialized(true);
    }
  }, [
    captureAttributionFromUrl,
    handlePreAuth,
    isAuthenticated,
    logout,
    openModalWithPendingAction,
    openModalWithPendingActionAtOtp,
    pathname,
    searchParams,
    setAuthInitialized,
    setLoading,
    setUser,
    normalizeParam,
    triggerApplyFlow,
  ]);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize auth validation
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Re-sync affiliate + UTM store on every client-side navigation (SPA).
   * Full page loads are covered by `initializeAuth`; `captureAttributionFromUrl` clears the
   * store when the URL has no params so partner code does not outlive the query string.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    captureAttributionFromUrl({ cleanUrl: false });
  }, [pathname, searchParamsString, captureAttributionFromUrl]);

  return <>{children}</>;
}