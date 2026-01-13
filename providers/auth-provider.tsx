'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authService } from '@/lib/api';
import { getCookie } from 'cookies-next';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * Validates existing auth token on app mount and syncs auth state with backend.
 * 
 * Flow (per PDF Step 1 - App Launch → Login State Identification):
 * 1. On mount, check if token exists in cookies
 * 2. If token exists, call validateToken API
 * 3. If valid, keep user authenticated
 * 4. If invalid, clear auth data and logout
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const hasInitialized = useRef(false);
  const { isAuthenticated, logout, setLoading } = useAuthStore();

  /**
   * Validates the existing auth token on app mount
   * Called once on initial render if user appears to be authenticated
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
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
  }, [isAuthenticated, logout, setLoading]);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initialize auth validation
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
