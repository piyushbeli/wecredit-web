'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
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
 * 
 * Flow (per PDF Step 1 - App Launch → Login State Identification):
 * 1. On mount, check for pre-auth parameters in URL
 * 2. If pre-auth found, apply it and skip validation
 * 3. Otherwise, check if token exists in cookies
 * 4. If token exists, call validateToken API
 * 5. If valid, keep user authenticated
 * 6. If invalid, clear auth data and logout
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const hasInitialized = useRef(false);
  const searchParams = useSearchParams();
  const { isAuthenticated, logout, setLoading, setUser } = useAuthStore();

  /**
   * Handle pre-authentication from URL parameters
   * Extracts pre_auth and mn from query params and applies them
   * @returns true if pre-auth was applied, false otherwise
   */
  const handlePreAuth = useCallback((): boolean => {
    const preAuth = searchParams?.get('pre_auth');
    const mobile = searchParams?.get('mn');

    // Both parameters must be present
    if (!preAuth || !mobile) {
      return false;
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

    console.log('[PRE-AUTH] Applied from URL:', { mobile, hasToken: true });

    // Clean up URL parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('pre_auth');
      url.searchParams.delete('mn');
      window.history.replaceState({}, '', url.toString());
    }

    return true; // Pre-auth was applied
  }, [searchParams, setUser]);

  /**
   * Validates the existing auth token on app mount
   * Called once on initial render if user appears to be authenticated
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    // First check for pre-auth in URL
    const preAuthApplied = handlePreAuth();
    
    if (preAuthApplied) {
      // Pre-auth was applied, skip token validation
      return;
    }

    // Check if token exists in cookies
    const token = getCookie(STORAGE_AUTH_TOKEN);
    
    if (!token) {
      // No token in cookies - ensure clean logout state
      if (isAuthenticated) {
        logout();
      }
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
        // Token is valid - auth state persisted in Zustand is correct
        // No action needed as user state is already in store
      }
    } catch (error) {
      // On error, clear auth for safety
      console.error('[AuthProvider] Token validation error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, logout, setLoading, handlePreAuth]);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize auth validation
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
