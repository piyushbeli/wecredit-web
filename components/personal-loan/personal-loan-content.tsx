'use client';

/**
 * Personal Loan Content - Client Component
 * Handles interactive logic: authentication, check-dedupe, modal state
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import LeadFormModal from '@/components/forms/lead-form-modal';
import { useCheckDedupe } from '@/hooks/use-check-dedupe';
import { useAuthStore } from '@/stores/auth-store';
import { PARTNER_CODE, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { cn } from '@/lib/utils';

/**
 * Client-side interactive component
 * Handles CTA button and modal interactions
 */
export function PersonalLoanContent() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, openModal } = useAuthStore();
  const { needsForm, checkDedupe, isLoading: isCheckingDedupe, response } = useCheckDedupe();
  const hasCheckedDedupe = useRef(false);
  const wasAuthenticated = useRef(isAuthenticated);

  /**
   * Watch for authentication state change (user just completed login)
   * Automatically run check-dedupe when user logs in
   */
  useEffect(() => {
    const runCheckDedupe = async (): Promise<void> => {
      const mobile = getCookie(STORAGE_MOBILE) as string;
      
      if (!mobile) {
        console.error('[PersonalLoan] No mobile number found after authentication');
        return;
      }

      await checkDedupe(mobile, PARTNER_CODE);
      hasCheckedDedupe.current = true;
    };

    // Detect authentication transition (user just logged in)
    if (isAuthenticated && !wasAuthenticated.current && !hasCheckedDedupe.current) {
      runCheckDedupe();
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, checkDedupe]);

  /**
   * Watch for check-dedupe response and navigate accordingly
   */
  useEffect(() => {
    if (response && !isCheckingDedupe && hasCheckedDedupe.current) {
      if (needsForm) {
        // User needs to fill form - open modal
        setIsModalOpen(true);
      } else {
        // User has existing data/offers - navigate to offers
        router.push('/offers');
      }
    }
  }, [response, needsForm, isCheckingDedupe, router]);

  /**
   * Handle "Check Offers Now" button click
   * Opens auth modal if not authenticated, otherwise runs check-dedupe
   */
  const handleOpenModal = async (): Promise<void> => {
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
      return;
    }

    hasCheckedDedupe.current = true;
    await checkDedupe(mobile, PARTNER_CODE);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lenderName=""
        isAllLenders={true}
      />
    </>
  );
}
