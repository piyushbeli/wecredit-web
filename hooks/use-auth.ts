'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { authService, clearAuthData } from '@/lib/api';
import type { User, PendingAction } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/hooks/use-loading';

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
  /**
   * Open auth modal using a pre-filled phone number.
   *
   * Used by loan / eligibility forms where the user has already entered a
   * valid mobile number in a preceding step. In this case we:
   * - Skip the phone input bottom sheet
   * - Use the provided phone for the login / OTP API
   * - Immediately transition the modal into the OTP screen.
   */
  openAuthModalWithPhone: (phoneNumber: string) => Promise<void>;
  /**
   * Open auth modal with phone and a pending action (e.g. submit_business_loan).
   * Skips phone input, sends OTP, shows OTP step; after OTP success the action is consumed.
   */
  openAuthModalWithPhoneAndAction: (phoneNumber: string, action: PendingAction) => Promise<void>;
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
  const { showLoading, hideLoading } = useLoading();
  const {
    isModalOpen,
    isAuthenticated,
    user,
    isLoading,
    pendingAction,
    openModal,
    openModalWithPendingAction,
    setPendingAction,
    closeModal,
    logout: storeLogout,
    consumePendingAction: storeConsumePendingAction,
    setStep,
    setPhoneNumber,
    setLoading,
    setError,
  } = useAuthStore();

  /** Logout and clear persisted auth data */
  const logout = useCallback((): void => {
    clearAuthData();
    storeLogout();
    router.push('/');
  }, [storeLogout]);

  /**
   * Open auth modal for a specific phone number and immediately trigger the OTP flow.
   *
   * This is used when the app already has a trusted mobile number from a form.
   * We avoid asking for the phone again and:
   * - store the phone in auth state
   * - open the auth modal
   * - send OTP
   * - switch directly to the OTP step.
   */
  const openAuthModalWithPhone = useCallback(
    async (rawPhoneNumber: string): Promise<void> => {
      const phoneDigits = (rawPhoneNumber || '').replace(/\D/g, '');

      // If we do not have a valid phone, fall back to the regular flow
      // so the user can enter it manually. Form validation should make this rare.
      if (phoneDigits.length !== 10) {
        openModal();
        return;
      }

      // Prepare auth store state before sending OTP.
      setPhoneNumber(phoneDigits);
      setError(null);
      setLoading(true);

      // Open modal immediately so the user sees feedback while OTP is sent.
      openModal();
      showLoading('Sending OTP...', 'We are verifying your phone number.');

      try {
        const result = await authService.sendOtp(phoneDigits);
        if (result.success) {
          // Jump directly to OTP screen since we already have the phone.
          setStep('otp');
          setLoading(false);
        } else {
          setError(result.error || 'Failed to send OTP. Please try again.');
          setLoading(false);
        }
      } finally {
        hideLoading();
      }
    },
    [hideLoading, openModal, setError, setLoading, setPhoneNumber, setStep, showLoading]
  );

  /**
   * Open auth modal with phone and pending action; skip phone input, go straight to OTP.
   * Used when form has mobile and we want to run an action after OTP (e.g. submit bl-leads).
   */
  const openAuthModalWithPhoneAndAction = useCallback(
    async (rawPhoneNumber: string, action: PendingAction): Promise<void> => {
      const phoneDigits = (rawPhoneNumber || '').replace(/\D/g, '');

      if (phoneDigits.length !== 10) {
        openModalWithPendingAction(action);
        return;
      }

      setPendingAction(action);
      setPhoneNumber(phoneDigits);
      setError(null);
      setLoading(true);

      openModal();
      showLoading('Sending OTP...', 'We are verifying your phone number.');

      try {
        const result = await authService.sendOtp(phoneDigits);
        if (result.success) {
          setStep('otp');
          setLoading(false);
        } else {
          setError(result.error || 'Failed to send OTP. Please try again.');
          setLoading(false);
        }
      } finally {
        hideLoading();
      }
    },
    [
      hideLoading,
      openModal,
      openModalWithPendingAction,
      setPendingAction,
      setError,
      setLoading,
      setPhoneNumber,
      setStep,
      showLoading,
    ]
  );

  return {
    isModalOpen,
    isAuthenticated,
    user,
    isLoading,
    pendingAction,
    openAuthModal: openModal,
    openAuthModalWithPhone,
    openAuthModalWithPhoneAndAction,
    openAuthModalWithAction: openModalWithPendingAction,
    closeAuthModal: closeModal,
    logout,
    consumePendingAction: storeConsumePendingAction,
  };
}
