'use client';

/**
 * UnmatchedOffersSection Component
 *
 * Displays eligibility rejected offers (wcStatus === 'ELIGIBILITY_REJECTED') with explanatory content
 * about why some lenders may not show offers. Shows a carousel of rejected lenders.
 */

import { useMemo } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';
import { useOfferStore } from '@/stores/offer-store';
import type { LenderOfferStatus } from '@/types/wecredit';

const UNMATCHED_REASONS = [
  "You don't meet the lenders eligibility criteria.",
  "Your location isn't currently serviceable by the lender.",
  'You already have an ongoing loan or recent application with this lender.',
] as const;

/**
 * Individual lender card showing "Not Eligible" status for rejected offers
 * Handles missing logos by showing lender name initial as fallback
 */
const UnmatchedLenderCard = ({ offer }: { offer: LenderOfferStatus }) => {
  const lenderName = offer.lenderName || 'Unknown Lender';
  const logo = offer.logo;
  const hasLogo = Boolean(logo);

  return (
    <div className="bg-white rounded-md p-3 flex flex-col items-center justify-center min-h-[60px]">
      {hasLogo ? (
        <Image
          src={logo!}
          alt={lenderName}
          width={34}
          height={15}
          className="object-contain h-4 w-auto mb-1"
        />
      ) : (
        // Fallback: Show lender initial when logo is missing
        <div className="w-8 h-6 mb-1 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-[10px] font-semibold text-gray-600">
            {lenderName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span className="text-[10px] text-gray-500 font-normal">{lenderName}</span>
      <span className="text-[10px] text-gray-500 font-normal">Not Eligible</span>
    </div>
  );
};

/**
 * Displays explanatory content about unmatched offers with carousel of rejected lenders
 * Only renders when there are rejected offers in the store
 */
export const UnmatchedOffersSection = () => {
  // Get all offers from store (stable reference)
  const offers = useOfferStore((state) => state.offers);

  // Memoize filtered eligibility rejected offers to prevent infinite loop
  // Only recalculates when offers array changes
  // Filter for ELIGIBILITY_REJECTED status (lender rejected due to eligibility criteria)
  const rejectedOffers = useMemo(
    () => offers.filter((offer) => offer.wcStatus === 'ELIGIBILITY_REJECTED'),
    [offers]
  );

  // Early return: Don't render section if no rejected offers exist
  if (rejectedOffers.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-lg p-4 overflow-hidden"
      style={{ backgroundColor: '#CCDFFC' }}
    >
      {/* Title */}
      <h3
        className="text-base font-medium mb-2 text-gray-700"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Unmatched Offers
      </h3>

      {/* Reasons list */}
      <ul className="space-y-0.5 mb-4">
        {UNMATCHED_REASONS.map((reason, index) => (
          <li
            key={index}
            className="text-xs leading-snug flex items-start gap-1 text-gray-500"
          >
            <span>•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>

      {/* Lender Carousel - Display rejected offers */}
      <Carousel options={{ loop: false, align: 'center' }}>
        <CarouselContent className="-ml-2">
          {rejectedOffers.map((offer, index) => (
            <CarouselSlide
              key={`${offer.lenderName}-${index}`}
              index={index}
              className="basis-full pl-2"
            >
              <UnmatchedLenderCard offer={offer} />
            </CarouselSlide>
          ))}
        </CarouselContent>

        {/* Pagination dots */}
        <CarouselDots
          className="mt-3"
          dotClassName="w-1.5 h-1.5 rounded-full transition-colors bg-gray-300"
          activeDotClassName="!w-2 !h-2 bg-[#045BCF]"
        />
      </Carousel>
    </section>
  );
};
