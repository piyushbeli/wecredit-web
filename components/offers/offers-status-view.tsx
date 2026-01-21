'use client';

import { getCookie } from 'cookies-next';
import { useOffers } from '@/hooks/use-offers';
import {
  OfferCard,
  OffersLoadingSkeleton,
  ErrorState,
  EmptyState,
  OffersHero,
} from '@/components/offers';
import type { LenderOfferStatus } from '@/types/wecredit';
import { updateUtmClicked } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import { PageHeader } from '@/components/shared';

/**
 * Offers Status View Component
 * Displays non-INITIATED offers in Status section
 */
export const OffersStatusView = () => {
  const { statusOffers, isLoading, error, fetchOffers } = useOffers();

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

    setTimeout(() => {
      fetchOffers();
    }, 3000); // 3 seconds
  };

  const hasStatusOffers = statusOffers.length > 0;

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

  return (
    <div className="min-h-screen">
      <PageHeader title="Loan Status" />
      <OffersHero eligibleAmount="₹1,00,000" offerCount={statusOffers.length} />

      <div className="px-4 pb-4">
        {!hasStatusOffers ? (
          <EmptyState 
            title="No active applications" 
            description="You haven't applied for any loans yet. Go back to explore offers."
          />
        ) : (
          <div className="space-y-6">
            {renderOfferSection('Check your application status', statusOffers)}
          </div>
        )}
      </div>
    </div>
  );
};
