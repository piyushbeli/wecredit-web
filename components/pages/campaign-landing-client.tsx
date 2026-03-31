'use client';

/**
 * Campaign Landing Client
 * Fullscreen lead form for campaign URLs (e.g. /personal-loan/lender/[lender]).
 * Validates lender name against active-lenders API before showing form.
 * Shows auto-fill modal first, then lead form with user's choice.
 * Same pattern as HomeLoanPageContent and BusinessLoanPageContent: fixed overlay
 * covers footer from first paint to avoid flash (no FOOTER_EXCLUDED_ROUTES needed).
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import LeadFormModal from '@/components/forms/lead-form-modal';
import AutoFillModal from '@/components/personal-loan/auto-fill-modal';
import { useFilteredActiveLenders } from '@/hooks/use-filtered-active-lenders';
import { getMatchedLenderCanonicalName } from '@/lib/utils/lenders';
import { useAuth } from '@/hooks/use-auth';

interface CampaignLandingClientProps {
  lenderName: string;
  partnerCode: string;
}

const INCORRECT_LENDER_ERROR = 'Incorrect Lender name';

export const CampaignLandingClient = ({
  lenderName,
  partnerCode,
}: CampaignLandingClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, openAuthModalWithPhone } = useAuth();
  const { activeLenders, isLoading, error } = useFilteredActiveLenders({
    fetchOnMount: true,
    // No mobile - fetch generic active lenders
  });

  // State for auto-fill modal and fetchDetails
  const [showAutoFillModal, setShowAutoFillModal] = useState<boolean>(false);
  const [showLeadFormModal, setShowLeadFormModal] = useState<boolean>(false);
  const [fetchDetails, setFetchDetails] = useState<boolean>(true);
  const loginTriggeredRef = useRef(false);
  const alreadyLoggedInToastRef = useRef(false);

  // Debug mode: skip auto-fill modal when ?debugAutoFill=true is in URL
  const isDebugMode = searchParams?.get('debugAutoFill') === 'true';

  const handleCloseModal = useCallback(() => {
    window.location.href = window.location.origin;
  }, [router]);

  // Reset modal state on mount (prevents reopening on browser back)
  useEffect(() => {
    setShowAutoFillModal(false);
    setShowLeadFormModal(false);
  }, []);

  // Redirect to home with error if lender is invalid (after load completes)
  useEffect(() => {
    if (isLoading) return;
    // API failed: redirect with generic error
    if (error) {
      toast.error('Failed to load lenders. Please try again.');
      router.replace('/');
      return;
    }
    // Lender not in active list: redirect with specific error
    const canonicalName = getMatchedLenderCanonicalName(lenderName, activeLenders);
    if (!canonicalName) {
      toast.error(INCORRECT_LENDER_ERROR);
      router.replace('/');
      return;
    }
    const mobile = searchParams.get('mn');

    if (mobile && isAuthenticated && !alreadyLoggedInToastRef.current) {
      const existingDigits = (user?.phoneNumber || '').replace(/\D/g, '');
      const mobileDigits = mobile.replace(/\D/g, '');

      // Only show the info toast when URL mn is different from the logged-in mobile.
      if (existingDigits && existingDigits !== mobileDigits) {
        alreadyLoggedInToastRef.current = true;
        const displayNumber = existingDigits || user?.phoneNumber || '';
        const message = `You are logged in with mobile ${displayNumber}. To login using url with a different number, please log out first.`;
        toast.info(message);
      }
    }

    if (mobile && !isAuthenticated && !loginTriggeredRef.current) {
      loginTriggeredRef.current = true;
      openAuthModalWithPhone(mobile);
      return;
    }

    // Valid lender: show auto-fill modal first
    setShowAutoFillModal(true);
  }, [isLoading, error, activeLenders, lenderName, router, searchParams, isAuthenticated, user, openAuthModalWithPhone]);

  /**
   * Handle auto-fill modal proceed
   * Sets fetchDetails value and opens the lead form modal
   * In debug mode, skip auto-fill modal and go straight to form
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
      setShowLeadFormModal(true);
    }, 300);
  }, [isDebugMode]);

  // Guard: Do not render form if API failed or lender is invalid (will redirect from useEffect)
  const canonicalLenderName = getMatchedLenderCanonicalName(lenderName, activeLenders);
  const showForm = !error && !!canonicalLenderName;

  return (
    <>
      {/* Auto-Fill Modal - shown first (renders above the original page background) */}
      <AutoFillModal
        isOpen={showAutoFillModal && showForm}
        onProceed={handleAutoFillProceed}
        onClose={() => {
          setShowAutoFillModal(false);
          // Reset fetchDetails to default when closing without proceeding
          setFetchDetails(true);
          // Close entire page
          handleCloseModal();
        }}
        disableTimer={isDebugMode}
      />

      {/* Fixed overlay - only shown AFTER auto-fill modal closes */}
      {showLeadFormModal && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {isLoading || !showForm ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          ) : (
            <LeadFormModal
              isOpen={showLeadFormModal}
              onClose={handleCloseModal}
              lenderName={canonicalLenderName}
              partnerCode={partnerCode}
              fetchDetails={fetchDetails}
            />
          )}
        </div>
      )}
    </>
  );
};