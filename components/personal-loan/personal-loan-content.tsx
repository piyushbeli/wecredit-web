'use client';

/**
 * Personal Loan Content - Client Component
 * Handles interactive logic: authentication, check-dedupe, modal state
 * Triggered by Apply Now and Start Loan Application buttons via store
 */

import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import LeadFormModal from '@/components/forms/lead-form-modal';
import AutoFillModal from '@/components/personal-loan/auto-fill-modal';
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
  const searchParams = useSearchParams();
  const { isOpen: isLeadFormModalOpen, openModal: openLeadFormModal, closeModal: closeLeadFormModal } = useModal();
  const { isAuthenticated, openModal }: { isAuthenticated: boolean; openModal: () => void } = useAuthStore();
  const { triggerApply, resetTrigger } = useLoanApplicationStore();
  const { needsForm, checkDedupe, isLoading: isCheckingDedupe, response }: UseCheckDedupeResult = useCheckDedupe();
  const hasCheckedDedupe = useRef<boolean>(false);
  const wasAuthenticated = useRef<boolean>(isAuthenticated);
  const didInitiateCheckOffers = useRef<boolean>(false);
  
  // State for auto-fill modal and fetchDetails
  const [showAutoFillModal, setShowAutoFillModal] = useState<boolean>(false);
  const [fetchDetails, setFetchDetails] = useState<boolean>(true);

  // Debug mode: open AutoFillModal when ?debugAutoFill=true is in URL
  const isDebugMode = searchParams?.get('debugAutoFill') === 'true';

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
        // Show auto-fill modal instead of directly opening lead form modal
        setShowAutoFillModal(true);
      }
    } else {
      router.push('/offers');
    }
    didInitiateCheckOffers.current = false;
  }, [needsForm, isCheckingDedupe, response, router]);

  /**
   * Handle auto-fill modal proceed
   * Sets fetchDetails value and opens the lead form modal
   * In debug mode, only closes the modal without opening lead form
   */
  const handleAutoFillProceed = useCallback((shouldFetchDetails: boolean): void => {
    setFetchDetails(shouldFetchDetails);
    setShowAutoFillModal(false);
    
    // In debug mode, just close the modal without opening lead form
    if (isDebugMode) {
      console.log('[Debug] AutoFillModal closed with fetchDetails:', shouldFetchDetails);
      return;
    }
    
    // Open lead form modal after auto-fill modal closes
    setTimeout(() => {
      openLeadFormModal();
    }, 300);
  }, [openLeadFormModal, isDebugMode]);

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
   * Debug mode: Open AutoFillModal when ?debugAutoFill=true is in URL
   * Useful for testing the modal UI without going through the full flow
   */
  useEffect(() => {
    if (isDebugMode) {
      setShowAutoFillModal(true);
    }
  }, [isDebugMode]);

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
    <>
      {/* Auto-Fill Modal - shown before lead form modal */}
      <AutoFillModal
        isOpen={showAutoFillModal}
        onProceed={handleAutoFillProceed}
        onClose={() => {
          setShowAutoFillModal(false);
          // Reset fetchDetails to default when closing without proceeding
          setFetchDetails(true);
        }}
        disableTimer={isDebugMode}
      />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isLeadFormModalOpen}
        onClose={closeLeadFormModal}
        lenderName=""
        isAllLenders={true}
        fetchDetails={fetchDetails}
      />
    </>
  );
};
