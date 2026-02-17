'use client';

import { getCookie } from 'cookies-next';
import { redirect, useRouter } from 'next/navigation';
import { useOffers } from '@/hooks/use-offers';
import { useMemo, useEffect , useRef} from 'react';


import {
  OfferCard,
  OffersHero,
  OffersLoadingSkeleton,
  ErrorState,
  PollingState,
  EmptyState,
  RecentlyClickedOffersCarousel,
} from '@/components/offers';
import { UnmatchedOffersSection } from './unmatched-offers-section';
import type { LenderOfferStatus } from '@/types/wecredit';
import { updateUtmClicked } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { ActionButton, PageHeader } from '@/components/shared';
import { useOfferStore } from '@/stores/offer-store';
import { useLoanApplicationStore } from '@/stores/loan-application-store';

/**
 * Offers View Component
 * Handles the interactive part of the offers page
 */
const parseAmountToNumber = (amount: string | number | undefined): number => {
  if (!amount) return 0;

  const value = String(amount).toLowerCase().trim();

  // Handle lakh / lakhs
  if (value.includes('lakh')) {
    const numeric = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(numeric) ? 0 : numeric * 100000;
  }

  // Handle normal numbers like 50000 or ₹1,20,000
  const numeric = parseFloat(value.replace(/[^\d.]/g, ''));
  return isNaN(numeric) ? 0 : numeric;
};

export const OffersView = () => {
  const router = useRouter();
   const { triggerApplyFlow } = useLoanApplicationStore(); 
  const reset = useOfferStore((state) => state.reset);
  useEffect(() => {return () => {reset();};}, [reset]);
  const { exploreOffers, isLoading, isPolling, error, fetchOffers, statusOffers, isReHitting, shouldTriggerApply } = useOffers();
  const hasTriggeredRef = useRef(false);

useEffect(() => {
  if (!shouldTriggerApply) return;
  // Step 1: Go to home
  router.replace('/');

  // Step 2: Trigger apply AFTER navigation
  Promise.resolve().then(() => {
  triggerApplyFlow();
});

}, [shouldTriggerApply, triggerApplyFlow]);


  const handleOfferClick = (offer: LenderOfferStatus): void => {
    // For non-INITIATED offers in explore screen, navigate to status page
    if (offer.wcStatus !== 'INITIATED') {
      router.push('/offers/status');
      return;
    }
    // For INITIATED offers, open UTM link
    const utmLink: string | undefined = offer.utmLink;
    if (!utmLink) {
      return;
    }
    const lenderName: string = offer.lenderName || '';
    const mobile: string | undefined = getCookie(STORAGE_MOBILE) as string | undefined;
    const token: string | undefined = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;
    // Update UTM clicked status for INITIATED offers
    if (lenderName && mobile) {
      void updateUtmClicked(mobile, lenderName, token);
    }
    window.open(utmLink, '_blank');
    // Refresh offers after 2 seconds to reflect status change
    setTimeout(() => {
      fetchOffers();
    }, 2000);
  };

  const handleRecentlyClickedOfferClick = (offer: LenderOfferStatus): void => {
    // For recently clicked offers, navigate to status page
    router.push('/offers/status');
  };
  const handleCheckStatus = (): void => {
    router.push('/offers/status');
  };
  const handleGoBack = (): void => {
    router.push('/');
  };
  // Calculate total offers including recently clicked
  const totalOffers = statusOffers.length + exploreOffers.length;
  const hasOffers = totalOffers > 0;
  const hasInitiatedOffers = exploreOffers.length > 0;
  const maxInitiatedAmount = useMemo(() => {
  return exploreOffers
    .filter((offer) => offer.wcStatus === 'INITIATED' && offer.uptoAmount)
    .map((offer) => parseAmountToNumber(offer.uptoAmount))
    .reduce((max, current) => Math.max(max, current), 0);
  }, [exploreOffers]);
  const formattedMaxAmount = useMemo(() => {
  return maxInitiatedAmount > 0
    ? `₹${maxInitiatedAmount.toLocaleString('en-IN')}`
    : null;
  }, [maxInitiatedAmount]);
  // Only show the status CTA once we have non-initiated offers to check.
  // const hasStatusOffers = statusOffers.length > 0;
  const hasStatusOffers = statusOffers.length > 0;
  const showPolling = isPolling && !hasOffers;
  const showEmpty = !isPolling && !hasOffers;
  const renderOfferSection = (title: string, offerList: LenderOfferStatus[]) => {
    if (offerList.length === 0) {
      return null;
    }
    return (
      <section className="space-y-3">
        <h2 className="lead-form-label">{title}</h2>
        <div className="space-y-4">
          {offerList.map((offer, index) => (
            <OfferCard
              key={`${offer.lenderName}-${index}`}
              offer={offer}
              onClick={() => handleOfferClick(offer)}
              variant="explore"
            />
          ))}
        </div>
      </section>
    );
  };
  
  // Show loading skeleton while: initial loading, polling, or re-hitting lenders
  if (isLoading || isPolling || isReHitting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OffersLoadingSkeleton />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorState error={error} onRetry={fetchOffers} />
      </div>
    );
  }

  // Only redirect if polling has completed and there are no explore offers
  // This allows polling to complete before redirecting to status page
  // if (!isPolling && exploreOffers.length === 0) {
  //   redirect('/offers/status');
  // }

  return (
    <div className="min-h-screen ">
      <PageHeader title="Offers for you" onBack={handleGoBack} />
      
      {/* Recently Clicked Offers Carousel - At the top */}
      {statusOffers.length > 0 && (
        <RecentlyClickedOffersCarousel 
          offers={statusOffers} 
          onOfferClick={handleRecentlyClickedOfferClick}
        />
      )}

      {/* Congratulations message */}
      {hasInitiatedOffers && formattedMaxAmount && (
    <div className="px-4 mb-4">
    <p
      className="text-blue-600 pt-2"
      style={{
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '153%',
        letterSpacing: '-0.01em',
      }}
    > Congratulations! You are eligible for a loan of upto {formattedMaxAmount}
    </p>
  </div>
)}


      <div className="px-4 pb-4">
        {showPolling && <PollingState />}
        {showEmpty && <EmptyState />}
        {hasOffers && (
          <div className="space-y-6">
            {renderOfferSection('', exploreOffers)}
            <UnmatchedOffersSection />
          </div>
        )}
      </div>
      {hasStatusOffers && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white border-t shadow-lg z-10">
          <ActionButton
            type="button"
            onClick={handleCheckStatus}
            fullWidth
            className="h-14 text-base font-medium"
          >
            Check your Loan Status
          </ActionButton>
        </div>
      )}
    </div>
  );
};
