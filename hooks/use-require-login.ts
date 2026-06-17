'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface UseRequireLoginOptions {
  /** Open the login modal (once) when true and the user isn't authenticated yet */
  shouldTrigger: boolean;
  /** Called when the login modal is closed/cancelled without the user authenticating */
  onCancel: () => void;
}

/**
 * Auth-first gate: opens the login modal once `shouldTrigger` is true (and the user
 * isn't already authenticated), then waits for login. If the modal is dismissed
 * without logging in, calls `onCancel`.
 * Mirrors the gate used by the multi-lender apply flow (PersonalLoanContent.handleOpenModal).
 */
export function useRequireLogin({ shouldTrigger, onCancel }: UseRequireLoginOptions): boolean {
  const { isAuthenticated, isModalOpen, openAuthModal } = useAuth();
  const triggeredRef = useRef(false);
  const modalWasOpenRef = useRef(false);

  useEffect(() => {
    if (!shouldTrigger || isAuthenticated || triggeredRef.current) return;
    triggeredRef.current = true;
    openAuthModal();
  }, [shouldTrigger, isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (!triggeredRef.current || isAuthenticated) {
      modalWasOpenRef.current = isModalOpen;
      return;
    }
    if (isModalOpen) {
      modalWasOpenRef.current = true;
    } else if (modalWasOpenRef.current) {
      onCancel();
    }
  }, [isModalOpen, isAuthenticated, onCancel]);

  return isAuthenticated;
}
