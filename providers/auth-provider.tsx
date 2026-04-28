'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { authService, setAuthToken, setMobile } from '@/lib/api';
import { getCookie, deleteCookie } from 'cookies-next';
import { AUTH_COOKIE_OPTIONS, STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { isAffiliateMnHubPath, runAffiliateMnFlow } from '@/lib/auth/affiliate-mn-flow';
import { getLoggedInAffiliateApplyTrigger } from '@/lib/auth/logged-in-affiliate-apply-trigger';
import { useAuthCookieSync } from '@/hooks/use-auth-cookie-sync';

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * Validates existing auth token on app mount and syncs auth state with backend.
 * Supports pre-authentication via URL parameters (pre_auth & mn).
 * Also handles partner and originSubLender URL params for lead creation.
 * 
 * Flow (per PDF Step 1 - App Launch → Login State Identification):
 * 1. On mount, check for pre-auth parameters in URL
 * 2. If pre-auth found, apply it and skip validation
 * 3. Extract partner and originSubLender from URL if present
 * 4. Trigger apply flow if pre-auth params are present
 * 5. Otherwise, check if token exists in cookies
 * 6. If token exists, call validateToken API
 * 7. If valid, keep user authenticated
 * 8. If invalid, clear auth data and logout
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const hasInitialized = useRef(false);
  const preAuthHandled = useRef(false);
  const mnAffiliateOtpOpenedRef = useRef(false);
  /**
   * Prevents double-opening apply (guest modal or logged-in triggerApplyFlow) when affiliate
   * query is present (Strict Mode / retries).
   */
  const partnerLenderApplyModalOpenedRef = useRef(false);
  const pathname = usePathname();
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
   * Handle pre-authentication from URL parameters
   * Extracts pre_auth, mn, partner, and originSubLender from query params
   * @returns true if pre-auth was applied, false otherwise
   */
  const handlePreAuth = useCallback((): boolean => {
    const preAuth = searchParams?.get('pre_auth');
    const mobile = searchParams?.get('mn');

    
    // Both pre_auth and mobile must be present for authentication
    if (!preAuth || !mobile) {
      // Without pre_auth, do not capture partner/originSubLender params
      return false;
    }

    // Capture partner + marketing attribution params for API calls.
    captureAttributionFromUrl({ cleanUrl: false });

    // Only skip if we've already handled THIS EXACT pre_auth in this session
    // Compare against stored values to allow new pre-auth params
    if (typeof window !== 'undefined') {
      const storedPreAuth = sessionStorage.getItem('pre_auth_token');
      const storedMobile = sessionStorage.getItem('pre_auth_mobile');
      if (storedPreAuth === preAuth && storedMobile === mobile) {
        // Same user → only update attribution

        // Remove only the token from the URL; keep affiliate params visible for partners.
        const url = new URL(window.location.href);
        url.searchParams.delete('pre_auth');
        window.history.replaceState({}, '', url.toString());

        return true;
      }
    }

    preAuthHandled.current = true;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pre_auth_handled', '1');
      sessionStorage.setItem('pre_auth_token', preAuth);
      sessionStorage.setItem('pre_auth_mobile', mobile);
    }

    // Clear old auth cookies to prevent stale data
    deleteCookie(STORAGE_AUTH_TOKEN, { path: AUTH_COOKIE_OPTIONS.path });
    deleteCookie(STORAGE_MOBILE, { path: AUTH_COOKIE_OPTIONS.path });

    // Use centralized helpers so cookie path/security settings stay consistent across flows.
    setAuthToken(preAuth);
    setMobile(mobile);
    // Update auth store
    setUser(
      {
        id: `user-${mobile}`,
        phoneNumber: mobile,
        name: `User ${mobile.slice(-4)}`,
      },
      preAuth
    );
    
    // Trigger apply flow after a short delay to ensure auth state is set
    setTimeout(() => {
      triggerApplyFlow();
    }, 100);

    // Remove only the pre_auth token from the URL; keep affiliate query params.
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('pre_auth');
      window.history.replaceState({}, '', url.toString());
    }
    return true; // Pre-auth was applied
  }, [captureAttributionFromUrl, searchParams, setUser, triggerApplyFlow]);

  /**
   * Validates the existing auth token on app mount
   * Called once on initial render if user appears to be authenticated
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    // First check for pre-auth in URL
    const preAuthApplied = handlePreAuth();
    if (preAuthApplied) {
      // Pre-auth was applied, skip token validation
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