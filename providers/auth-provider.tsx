'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { authService } from '@/lib/api';
import { getCookie, setCookie } from 'cookies-next';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';

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
  const searchParams = useSearchParams();
  const { isAuthenticated, logout, setLoading, setUser, setAuthInitialized } = useAuthStore();
  const { setUrlParams } = useUrlParamsStore();
  const { triggerApplyFlow } = useLoanApplicationStore();
  console.log("AUTH PROVIDER:", {isAuthenticated })
  /**
   * Handle pre-authentication from URL parameters
   * Extracts pre_auth, mn, partner, and originSubLender from query params
   * @returns true if pre-auth was applied, false otherwise
   */
  const handlePreAuth = useCallback((): boolean => {
    if (preAuthHandled.current || (typeof window !== 'undefined' && sessionStorage.getItem('pre_auth_handled'))) return false;
    const preAuth = searchParams?.get('pre_auth');
    const mobile = searchParams?.get('mn');
    const partner = searchParams?.get('partner');
    const originSubLender = searchParams?.get('originSubLender');
    
    // Both pre_auth and mobile must be present for authentication
    if (!preAuth || !mobile) {
      // Without pre_auth, do not capture partner/originSubLender params
      return false;
    }
    preAuthHandled.current = true;
    if (typeof window !== 'undefined') sessionStorage.setItem('pre_auth_handled', '1');
    
    // Store URL params if present (they'll be used in lead form)
    if (partner || originSubLender) {
      setUrlParams(partner, originSubLender);
      console.log('[PRE-AUTH] URL params captured:', { partner, originSubLender });
    }
    
    // Set auth token in cookie
    setCookie(STORAGE_AUTH_TOKEN, preAuth, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // Set mobile in cookie
    setCookie(STORAGE_MOBILE, mobile, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // Update auth store
    setUser(
      {
        id: `user-${mobile}`,
        phoneNumber: mobile,
        name: `User ${mobile.slice(-4)}`,
      },
      preAuth
    );
    console.log('[PRE-AUTH] Applied from URL:', { mobile, hasToken: true, partner, originSubLender });
    
    // Trigger apply flow after a short delay to ensure auth state is set
    setTimeout(() => {
      triggerApplyFlow();
      console.log('[PRE-AUTH] Triggered apply flow');
    }, 100);
    
    // Clean up URL parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('pre_auth');
      url.searchParams.delete('mn');
      url.searchParams.delete('partner');
      url.searchParams.delete('originSubLender');
      window.history.replaceState({}, '', url.toString());
    }
    return true; // Pre-auth was applied
  }, [searchParams, setUser, setUrlParams, triggerApplyFlow]);

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
    // Check if token exists in cookies
    const token = getCookie(STORAGE_AUTH_TOKEN);
    const mobile = getCookie(STORAGE_MOBILE);
    if (!token || !mobile) {
      // No token in cookies - ensure clean logout state
      if (isAuthenticated) {
        logout();
      }
      setAuthInitialized(true);
      return;
    }
    // Token exists - validate with backend
    setLoading(true);
    try {
      const result = await authService.validateToken();
      if (!result.isValid) {
        // Token is invalid - clear auth state
        // authService.validateToken already calls clearAllAuthData()
        logout();
        console.info('[AuthProvider] Token validation failed, user logged out');
      } else {
        console.info('[AuthProvider] Token validated successfully');
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
      }
    } catch (error) {
      // On error, clear auth for safety
      console.error('[AuthProvider] Token validation error:', error);
      logout();
    } finally {
      setLoading(false);
      setAuthInitialized(true);
    }
  }, [handlePreAuth, isAuthenticated, logout, setAuthInitialized, setLoading, setUser]);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize auth validation
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}