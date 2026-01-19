'use client';

/**
 * Personal Loan Content - Client Component
 * Handles interactive logic: authentication, check-dedupe, modal state
 * Triggered by Apply Now and Start Loan Application buttons via store
 */

import { JSX, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import LeadFormModal from '@/components/forms/lead-form-modal';
import { useCheckDedupe } from '@/hooks/use-check-dedupe';
import { useModal } from '@/hooks/use-modal';
import { useAuthStore } from '@/stores/auth-store';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { PARTNER_CODE, STORAGE_MOBILE } from '@/lib/constants/api-keys';

type UseCheckDedupeResult = ReturnType<typeof useCheckDedupe>;

/**
 * Client-side interactive component
 * Handles modal and auth/dedupe flow logic
 * Triggered by Apply Now and Start Loan Application buttons
 */
export const PersonalLoanContent = (): JSX.Element => {
  const router = useRouter();
  const { isOpen: isLeadFormModalOpen, openModal: openLeadFormModal, closeModal: closeLeadFormModal } = useModal();
  const { isAuthenticated, openModal }: { isAuthenticated: boolean; openModal: () => void } = useAuthStore();
  const { triggerApply, resetTrigger } = useLoanApplicationStore();
  const { needsForm, checkDedupe, isLoading: isCheckingDedupe, response }: UseCheckDedupeResult = useCheckDedupe();
  const hasCheckedDedupe = useRef<boolean>(false);
  const wasAuthenticated = useRef<boolean>(isAuthenticated);
  const didInitiateCheckOffers = useRef<boolean>(false);

  const runCheckDedupeAfterAuth = useCallback(async (): Promise<void> => {
    const mobile = getCookie(STORAGE_MOBILE) as string;
    if (!mobile) {
      console.error('[PersonalLoan] No mobile number found after authentication');
      didInitiateCheckOffers.current = false;
      return;
    }
    await checkDedupe(mobile, PARTNER_CODE);
    hasCheckedDedupe.current = true;
  }, [checkDedupe]);

  const handleDedupeResponse = useCallback((): void => {
    if (!response || isCheckingDedupe || !hasCheckedDedupe.current) {
      return;
    }
    if (needsForm) {
      if (didInitiateCheckOffers.current) {
        openLeadFormModal();
      }
    } else {
      router.push('/offers');
    }
    didInitiateCheckOffers.current = false;
  }, [needsForm, openLeadFormModal, isCheckingDedupe, response, router]);

  /**
   * Watch for authentication state change (user just completed login)
   * Automatically run check-dedupe when user logs in
   */
  useEffect(() => {
    const justAuthenticated = isAuthenticated && !wasAuthenticated.current;
    const shouldRunDedupe = justAuthenticated && !hasCheckedDedupe.current && didInitiateCheckOffers.current;
    
    if (shouldRunDedupe) {
      runCheckDedupeAfterAuth();
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, runCheckDedupeAfterAuth]);

  /**
   * Watch for check-dedupe response and navigate accordingly
   */
  useEffect(() => {
    handleDedupeResponse();
  }, [handleDedupeResponse]);

  /**
   * Watch for triggerApply from other components (Apply Now, Start Loan Application buttons)
   * Executes the same flow as handleOpenModal when triggered
   */
  useEffect(() => {
    if (triggerApply) {
      handleOpenModal();
      resetTrigger();
    }
  }, [triggerApply, resetTrigger]);

  /**
   * Handle "Check Offers Now" button click
   * Triggers auth/dedupe flow for offers
   */
  const handleOpenModal = async (): Promise<void> => {
    didInitiateCheckOffers.current = true;
    
    if (!isAuthenticated) {
      openModal();
      return;
    }
    
    const mobile = getCookie(STORAGE_MOBILE) as string;
    if (!mobile) {
      console.error('[PersonalLoan] No mobile number found in cookies');
      didInitiateCheckOffers.current = false;
      return;
    }
    
    hasCheckedDedupe.current = true;
    await checkDedupe(mobile, PARTNER_CODE);
  };

  return (
    <LeadFormModal
      isOpen={isLeadFormModalOpen}
      onClose={closeLeadFormModal}
      lenderName=""
      isAllLenders={true}
    />
  );
};
