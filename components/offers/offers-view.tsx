'use client';

import { getCookie } from 'cookies-next';
import { redirect, useRouter } from 'next/navigation';
import { useOffers } from '@/hooks/use-offers';
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

/**
 * Offers View Component
 * Handles the interactive part of the offers page
 */
export const OffersView = () => {
  const router = useRouter();
  const { exploreOffers, isLoading, isPolling, error, fetchOffers, statusOffers } = useOffers();
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

  // Calculate total offers including recently clicked
  const totalOffers = statusOffers.length + exploreOffers.length;
  const hasOffers = totalOffers > 0;
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
  if (isLoading) {
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
      <PageHeader title="Offers for you" />
      
      {/* Recently Clicked Offers Carousel - At the top */}
      {statusOffers.length > 0 && (
        <RecentlyClickedOffersCarousel 
          offers={statusOffers} 
          onOfferClick={handleRecentlyClickedOfferClick}
        />
      )}

      {/* Congratulations message */}
      {hasOffers && (
        <div className="px-4 mb-4">
          <p className="text-blue-600 text-sm font-medium">
            Congratulations! You are eligible for a loan of upto ₹1,00,000
          </p>
        </div>
      )}

      <div className="px-4 pb-4">
        {showPolling && <PollingState />}
        {showEmpty && <EmptyState />}
        {hasOffers && (
          <div className="space-y-6">
            {renderOfferSection('Please select the offers you are interested in.', exploreOffers)}
            <UnmatchedOffersSection />
          </div>
        )}
      </div>
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
    </div>
  );
};
