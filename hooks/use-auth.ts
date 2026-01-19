'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { clearAuthData } from '@/lib/api';
import type { User, PendingAction } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

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
  /** Current pending action (if any) */
  pendingAction: PendingAction | null;
  /** Open the auth modal */
  openAuthModal: () => void;
  /** Open auth modal with a pending action to execute after login (PDF Step 5A) */
  openAuthModalWithAction: (action: PendingAction) => void;
  /** Close the auth modal */
  closeAuthModal: () => void;
  /** Logout and clear auth data */
  logout: () => void;
  /** Get and clear pending action - call this after successful login to continue */
  consumePendingAction: () => PendingAction | null;
}

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 * Supports pending actions for post-login continuation (PDF Step 5A)
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user, openAuthModal, openAuthModalWithAction } = useAuth();
 *
 * // Simple login
 * if (!isAuthenticated) {
 *   return <button onClick={openAuthModal}>Login</button>;
 * }
 *
 * // Login with pending action (e.g., clicking offer when not logged in)
 * const handleOfferClick = (lenderId: string, href: string) => {
 *   if (!isAuthenticated) {
 *     openAuthModalWithAction({
 *       type: 'navigate_to_offer',
 *       lenderId,
 *       lenderName: 'Lender',
 *       href,
 *     });
 *     return;
 *   }
 *   // User is logged in - proceed directly
 *   router.push(href);
 * };
 * ```
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const {
    isModalOpen,
    isAuthenticated,
    user,
    isLoading,
    pendingAction,
    openModal,
    openModalWithPendingAction,
    closeModal,
    logout: storeLogout,
    consumePendingAction: storeConsumePendingAction,
  } = useAuthStore();

  /** Logout and clear persisted auth data */
  const logout = useCallback((): void => {
    clearAuthData();
    storeLogout();
    router.push('/');
  }, [storeLogout]);

  return {
    isModalOpen,
    isAuthenticated,
    user,
    isLoading,
    pendingAction,
    openAuthModal: openModal,
    openAuthModalWithAction: openModalWithPendingAction,
    closeAuthModal: closeModal,
    logout,
    consumePendingAction: storeConsumePendingAction,
  };
}
