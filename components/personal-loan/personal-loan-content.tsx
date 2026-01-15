'use client';

/**
 * Personal Loan Content - Client Component
 * Handles interactive logic: authentication, check-dedupe, modal state
 */

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import LeadFormModal from '@/components/forms/lead-form-modal';
import { useCheckDedupe } from '@/hooks/use-check-dedupe';
import { useModal } from '@/hooks/use-modal';
import { useAuthStore } from '@/stores/auth-store';
import { PARTNER_CODE, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { cn } from '@/lib/utils';

type UseRouterResult = ReturnType<typeof useRouter>;
type UseCheckDedupeResult = ReturnType<typeof useCheckDedupe>;

/**
 * Client-side interactive component
 * Handles CTA button and modal interactions
 */
export function PersonalLoanContent() {
  const router: UseRouterResult = useRouter();
  const { isOpen: isLeadFormModalOpen, openModal: openLeadFormModal, closeModal: closeLeadFormModal } = useModal();
  const { isAuthenticated, openModal }: { isAuthenticated: boolean; openModal: () => void } = useAuthStore();
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
    // Detect authentication transition (user just logged in)
    if (isAuthenticated && !wasAuthenticated.current && !hasCheckedDedupe.current && didInitiateCheckOffers.current) {
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
   * Handle "Check Offers Now" button click
   * Triggers auth/dedupe flow for offers
   */
  const handleOpenModal = async (): Promise<void> => {
    didInitiateCheckOffers.current = true;
    if (!isAuthenticated) {
      // User not authenticated - open auth modal
      // Check-dedupe will be triggered automatically after login via useEffect
      openModal();
      return;
    }
    // User already authenticated - run check-dedupe manually
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
      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-10">
        <button
          onClick={handleOpenModal}
          disabled={isCheckingDedupe}
          className={cn(
            'w-full py-4 rounded-full font-semibold text-base',
            'bg-linear-to-r from-blue-500 to-blue-600',
            'text-white shadow-lg shadow-blue-500/30',
            'hover:from-blue-600 hover:to-blue-700',
            'active:scale-[0.98] transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isCheckingDedupe ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Checking...
            </span>
          ) : (
            'Check Offers Now'
          )}
        </button>
      </div>
      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isLeadFormModalOpen}
        onClose={closeLeadFormModal}
        lenderName=""
        isAllLenders={true}
      />
    </>
  );
}
