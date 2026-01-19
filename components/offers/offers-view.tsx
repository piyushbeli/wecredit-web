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
} from '@/components/offers';
import type { LenderOfferStatus } from '@/types/wecredit';
import { updateUtmClicked } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { ActionButton } from '@/components/shared';

/**
 * Offers View Component
 * Handles the interactive part of the offers page
 */
export const OffersView = () => {
  const router = useRouter();
  const { exploreOffers, isLoading, isPolling, error, fetchOffers } = useOffers();
  const handleOfferClick = (offer: LenderOfferStatus): void => {
    const utmLink: string | undefined = offer.utmLink;
    if (!utmLink) {
      return;
    }
    const lenderName: string = offer.lenderName || '';
    const mobile: string | undefined = getCookie(STORAGE_MOBILE) as string | undefined;
    const token: string | undefined = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;
    const isUtmClicked: boolean = offer.wcStatus === 'UTM_CLICKED';
    if (lenderName && mobile && !isUtmClicked) {
      void updateUtmClicked(mobile, lenderName, token);
    }
    window.open(utmLink, '_blank'); 
    fetchOffers();
  };
  const handleCheckStatus = (): void => {
    router.push('/offers/status');
  };
  const hasOffers = exploreOffers.length > 0;
  const showPolling = isPolling && !hasOffers;
  const showEmpty = !isPolling && !hasOffers;
  const renderOfferSection = (title: string, offerList: LenderOfferStatus[]) => {
    if (offerList.length === 0) {
      return null;
    }
    return (
      <section className="space-y-3">
        <h2 className="lead-form-heading">{title}</h2>
        <div className="space-y-4">
          {offerList.map((offer, index) => (
            <OfferCard
              key={`${offer.lenderName}-${index}`}
              offer={offer}
              onClick={() => handleOfferClick(offer)}
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

  if (exploreOffers.length === 0) {
    redirect('/offers/status');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Loan offers</h1>
          </div>
        </div>
      </header>
      <OffersHero eligibleAmount="₹1,00,000" offerCount={exploreOffers.length} />
      <div className="px-4 py-4 pb-28">
        {showPolling && <PollingState />}
        {showEmpty && <EmptyState />}
        {hasOffers && (
          <div className="space-y-6">
            {renderOfferSection('Explore more loan offers', exploreOffers)}
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
