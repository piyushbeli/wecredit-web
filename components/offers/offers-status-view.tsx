'use client';

import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
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
import { ActionButton } from '@/components/shared';

/**
 * Offers Status View Component
 * Displays non-INITIATED offers in Status section
 */
export const OffersStatusView = () => {
  const router = useRouter();
  const { offers, isLoading, error, fetchOffers, canReHit, isReHitting, reHitLenders } = useOffers();

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

  const handleUnlockMore = async () => {
    await reHitLenders();
    await fetchOffers();
  };

  const statusOffers = offers.filter(offer => offer.wcStatus !== 'INITIATED');
  const hasStatusOffers = statusOffers.length > 0;

  const renderOfferSection = (title: string, offerList: LenderOfferStatus[], variant?: 'utmClicked') => {
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
              variant={variant}
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

  return (
    <div className="min-h-screen bg-gray-50 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-16">
      <OffersHero eligibleAmount="₹1,00,000" offerCount={statusOffers.length} />

      <div className="px-4 py-6">
        {!hasStatusOffers ? (
          <EmptyState 
            title="No active applications" 
            description="You haven't applied for any loans yet. Go back to explore offers."
          />
        ) : (
          <div className="space-y-6">
            {renderOfferSection('Check your application status', statusOffers, 'utmClicked')}
          </div>
        )}
      </div>
    </div>
  );
};
