'use client';

import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { newPLEnabled, useOffers } from '@/hooks/use-offers';
import {
  OfferCard,
  OffersLoadingSkeleton,
  ErrorState,
  EmptyState,
  OffersHero,
} from '@/components/offers';
import type { LenderOfferStatus } from '@/types/wecredit';
import { updateUtmClicked } from '@/lib/api/wecredit';
import { notifyForwardNavigationEvent } from '@/lib/api/upswing-navigation-event';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { ActionButton, PageHeader } from '@/components/shared';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { buildOffersPathClearingLenderFilter, buildOffersPathWithQuery } from '@/lib/utils/offers-navigation';
import { useUrlParamsStore } from '@/stores/url-params-store';


/**
 * Offers Status View Component
 * Displays non-INITIATED offers in Status section
 */
export const OffersStatusView = () => {
  const router = useRouter();
const {partner} = useUrlParamsStore()
  const searchParams = useSearchParams();
  const { statusOffers, isLoading, error, fetchOffers, shouldTriggerApply, reHitLenders } = useOffers();
 const { triggerApplyFlow } = useLoanApplicationStore();
const hasTriggeredRef = useRef(false);

useEffect(() => {
  if (partner) return;
  if (!shouldTriggerApply) return;
  if (hasTriggeredRef.current) return;

  hasTriggeredRef.current = true;

  // Step 1: Go home
  router.replace('/');

  // Step 2: Trigger apply after navigation
  Promise.resolve().then(() => {
  triggerApplyFlow();
});


}, [shouldTriggerApply, router, triggerApplyFlow]);


  const handleOfferClick = (offer: LenderOfferStatus): void => {
    const utmLink: string | undefined = offer.utmLink;
    const offerLenderName = offer.lenderName?.toLowerCase();
    const isLntOffer = offerLenderName === 'lnt' || offerLenderName === 'upswing_lnt';
    if (!utmLink) {
      return;
    }
    const lenderName: string = offer.lenderName || '';
    const mobile: string | undefined = getCookie(STORAGE_MOBILE) as string | undefined;
    const token: string | undefined = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;
    const isUtmClicked: boolean = offer.wcStatus === 'UTM_CLICKED';

    if (lenderName && mobile && !isUtmClicked) {
      //void updateUtmClicked(mobile, lenderName, token);
    }

    if (mobile && isLntOffer) {
      void notifyForwardNavigationEvent(mobile, utmLink);
    }
    window.open(utmLink, '_blank'); 

    setTimeout(() => {
      fetchOffers();
    }, 3000); // 3 seconds
  };

  const hasStatusOffers = statusOffers.length > 0;
  const handleExploreMore = async () => {
    if (newPLEnabled) {
      await reHitLenders();
    }
    window.location.replace(buildOffersPathClearingLenderFilter(searchParams));
  };

  const handleGoBack = () => {
    router.push(buildOffersPathWithQuery('/offers',searchParams));
  };
  
  const renderOfferSection = (title: string, offerList: LenderOfferStatus[]) => {
    if (offerList.length === 0) {
      return null;
    }
    return (
      <section className="space-y-3">
        <div className="space-y-4">
          {offerList.map((offer, index) => (
            <OfferCard
              key={`${offer.lenderName}-${index}`}
              offer={offer}
              onClick={() => handleOfferClick(offer)}
              variant="status"
            />
          ))}
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-xl mx-auto">
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

  return (
    <div className="min-h-screen">
      <PageHeader title="Loan Status"  isOfferStatus={true} onBack={handleGoBack} />
      {hasStatusOffers && <OffersHero eligibleAmount="₹1,00,000" offerCount={statusOffers.length} />}

      <div className="px-4 pb-4 max-w-xl mx-auto">
        {!hasStatusOffers ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
            <EmptyState 
              title="No active applications" 
              description="You haven't applied for any loans yet. Go back to explore offers."
            />
            <ActionButton
                  type="button"
                  onClick={handleExploreMore}
                  className="w-full max-w-xs"
                >
                  Explore Other Offers
                </ActionButton>
          </div>
        ) : (
          <div className="space-y-6">
            {renderOfferSection('Check loan status', statusOffers)}
          </div>
        )}
      </div>
    </div>
  );
};
