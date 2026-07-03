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
import { MoneyViewForm } from '@/components/moneyview';
import { useFilteredActiveLenders } from '@/hooks/use-filtered-active-lenders';
import { getMatchedLenderCanonicalName } from '@/lib/utils/lenders';
import { useAuth } from '@/hooks/use-auth';
import { useRequireLogin } from '@/hooks/use-require-login';
import { useOffers } from '@/hooks/use-offers';
import { PageLoader } from '../shared/page-loader';

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

  // Hook to check existing offers
  const {
    isLoading: isOffersLoading,
    shouldNavigateToOffersPage,
  } = useOffers();

  // State for auto-fill modal and fetchDetails
  const [showAutoFillModal, setShowAutoFillModal] = useState<boolean>(false);
  const [showLeadFormModal, setShowLeadFormModal] = useState<boolean>(false);
  const [fetchDetails, setFetchDetails] = useState<boolean>(true);
  const loginTriggeredRef = useRef(false);
  const alreadyLoggedInToastRef = useRef(false);


  // Show loading when checking offers or during initial load
  const showLoading = isLoading || isOffersLoading;

  // Debug mode: skip auto-fill modal when ?debugAutoFill=true is in URL
  const isDebugMode = searchParams?.get('debugAutoFill') === 'true';

  const handleCloseModal = useCallback(() => {
    window.location.href = window.location.origin;
  }, [router]);

  const mobile = searchParams.get('mn');
  const canonicalLenderName = getMatchedLenderCanonicalName(lenderName, activeLenders);

  // No mobile param: require login first, same auth-first gate the multi-lender apply
  // flow uses (PersonalLoanContent.handleOpenModal opens the auth modal before any apply modal).
  useRequireLogin({
    shouldTrigger: !isLoading && !error && !!canonicalLenderName && !mobile,
    onCancel: handleCloseModal,
  });

  // Reset modal state on mount (prevents reopening on browser back)
  useEffect(() => {
    setShowAutoFillModal(false);
    setShowLeadFormModal(false);
  }, []);

  useEffect(() => {
    if (shouldNavigateToOffersPage) {
      router.push('/offers');
      return;
    }
  }, [shouldNavigateToOffersPage, router]);

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
    if (!canonicalLenderName) {
      toast.error(INCORRECT_LENDER_ERROR);
      router.replace('/');
      return;
    }

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

    // No mobile param and not authenticated: useRequireLogin above owns the auth
    // gate (opens the login modal, redirects home on cancel) — wait for it.
    if (!mobile && !isAuthenticated) {
      return;
    }

    // Valid lender: show auto-fill modal first
    setShowAutoFillModal(true);

  }, [isLoading, error, canonicalLenderName, mobile, router, isAuthenticated, user, openAuthModalWithPhone]);

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
  const showForm = !error && !!canonicalLenderName;

  // Check if this is a MoneyView lender for custom form rendering
  const isMoneyViewLender = canonicalLenderName?.toLowerCase() === 'moneyview';

  /**
   * Render the lead form content
   * If loading, show the loader
   * If lead form modal is open, show the lead form
   * Otherwise, return null
   */
  const renderLeadFormContent = () => {
    if (showLoading || !showForm) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      );
    }

    if (isMoneyViewLender) {
      return (
        <MoneyViewForm
          onSuccess={() => setShowLeadFormModal(false)}
          onClose={handleCloseModal}
        />
      );
    }

    return (
      <LeadFormModal
        isOpen={showLeadFormModal}
        onClose={handleCloseModal}
        lenderName={canonicalLenderName}
        partnerCode={partnerCode}
        fetchDetails={fetchDetails}
      />
    );
  };

  /**
   * Render the page content
   * If loading, show the loader
   * If lead form modal is open, show the lead form
   * Otherwise, return null
   */
  const renderPageContent = () => {
    if (showLoading) return <PageLoader />;
    if (showLeadFormModal) return <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">{renderLeadFormContent()}</div>;
    return null;
  };

  const handleAutoFillCloseModal = () => {
    setShowAutoFillModal(false);
    // Reset fetchDetails to default when closing without proceeding
    setFetchDetails(true);
    // Close entire page
    handleCloseModal();
  };

  return (
    <>
      {/* Auto-Fill Modal - shown first (renders above the original page background) */}
      <AutoFillModal
        isOpen={showAutoFillModal && showForm}
        onProceed={handleAutoFillProceed}
        onClose={handleAutoFillCloseModal}
        disableTimer={isDebugMode}
      />

      {/* Fixed overlay - only shown AFTER auto-fill modal closes */}
      {renderPageContent()}
    </>
  );
};