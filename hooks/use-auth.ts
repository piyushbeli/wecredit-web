'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { clearAuthData } from '@/lib/api';
import type { User } from '@/stores/auth-store';

/**
 * Return type for useAuth hook
 */
interface UseAuthReturn {
  /** Whether the auth modal is open */
  isModalOpen: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user data */
  user: User | null;
  /** Whether an auth operation is loading */
  isLoading: boolean;
  /** Open the auth modal */
  openAuthModal: () => void;
  /** Close the auth modal */
  closeAuthModal: () => void;
  /** Logout and clear auth data */
  logout: () => void;
}

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user, openAuthModal, logout } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <button onClick={openAuthModal}>Login</button>;
 * }
 *
 * return <span>Welcome, {user?.name}</span>;
 * ```
 */
export function useAuth(): UseAuthReturn {
  const {
    isModalOpen,
    isAuthenticated,
    user,
    isLoading,
    openModal,
    closeModal,
    logout: storeLogout,
  } = useAuthStore();

  /** Logout and clear persisted auth data */
  const logout = useCallback((): void => {
    clearAuthData();
    storeLogout();
  }, [storeLogout]);

  return {
    isModalOpen,
    isAuthenticated,
    user,
    isLoading,
    openAuthModal: openModal,
    closeAuthModal: closeModal,
    logout,
  };
}
