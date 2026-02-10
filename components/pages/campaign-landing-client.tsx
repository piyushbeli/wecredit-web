'use client';

/**
 * Campaign Landing Client
 * Fullscreen lead form for campaign URLs (e.g. /personal-loan/lender/[lender]).
 * Validates lender name against active-lenders API before showing form.
 * Same pattern as HomeLoanPageContent and BusinessLoanPageContent: fixed overlay
 * covers footer from first paint to avoid flash (no FOOTER_EXCLUDED_ROUTES needed).
 */

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import LeadFormModal from '@/components/forms/lead-form-modal';
import { useFilteredActiveLenders } from '@/hooks/use-filtered-active-lenders';
import { getMatchedLenderCanonicalName } from '@/lib/utils/lenders';

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
  const { activeLenders, isLoading, error } = useFilteredActiveLenders({
    fetchOnMount: true,
    // No mobile - fetch generic active lenders
  });

  const handleCloseModal = useCallback(() => {
    router.push('/personal-loan');
  }, [router]);

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
    }
  }, [isLoading, error, activeLenders, lenderName, router]);

  // Guard: Do not render form if API failed or lender is invalid (will redirect from useEffect)
  const canonicalLenderName = getMatchedLenderCanonicalName(lenderName, activeLenders);
  const showForm = !error && !!canonicalLenderName;

  // Fixed overlay from first paint (like BusinessLoanFormModal) so footer is never visible
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {isLoading || !showForm ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <LeadFormModal
          isOpen
          onClose={handleCloseModal}
          lenderName={canonicalLenderName}
          partnerCode={partnerCode}
        />
      )}
    </div>
  );
};
