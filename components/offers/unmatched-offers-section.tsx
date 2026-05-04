'use client';

/**
 * UnmatchedOffersSection Component
 *
 * Shows API-driven inactive-lender outcomes first, then static inactive lenders for awareness.
 */

import { useMemo } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';
import type { LenderOfferStatus } from '@/types/wecredit';

const UNMATCHED_REASONS = [
  "You don't meet the lenders eligibility criteria.",
  "Your location isn't currently serviceable by the lender.",
  'You already have an ongoing loan or recent application with this lender.',
] as const;

/**
 * Inactive lenders that are always displayed in unmatched section
 * These are not currently not active - shown for user awareness
 */
const ALWAYS_SHOWN_INACTIVE_LENDERS = [
  { name: 'PREFR', logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/prefr-1.png' },
  { name: 'UNITY', logo: 'https://wcstaticasset.blob.core.windows.net/assets/unity_logo.png' },
  { name: 'KREDITO', logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/kredito.jpeg' },
  { name: 'ABFL BL', logo: 'https://wcstaticasset.blob.core.windows.net/assets/abcf_logo.png' },
  { name: 'ABFL', logo: 'https://wcstaticasset.blob.core.windows.net/assets/abcf_logo.png' },
  { name: 'BRANCH', logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/unnamed.jpg' },
  { name: 'INSTAMONEY', logo: 'https://wcstaticasset.blob.core.windows.net/assets/InstaMoney-Logo.png' },
] as const;

// Carousel styling constants
const CAROUSEL_SLIDE_PADDING = 'px-10';
const DOT_SIZE = 'w-[6px] h-[6px]';
const ACTIVE_DOT_SIZE = '!w-[8px] !h-[8px]';
const DOT_GAP = 'gap-[2px]';

type CarouselLenderRow = {
  key: string;
  lenderName: string;
  logo?: string;
  /** Shown under the lender name (API rows use "Rejected" per product copy). */
  statusLabel: string;
};

/* ------------------ Lender Card ------------------ */

/**
 * Individual lender card component
 * Shows logo (or fallback initials), lender name, and a short status line
 */
const UnmatchedLenderCard = ({
  lenderName,
  logo,
  statusLabel,
}: {
  lenderName: string;
  logo?: string;
  statusLabel: string;
}) => {
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white rounded-[8px] px-4 py-2 flex flex-col items-center justify-center min-h-[80px]">
      {logo ? (
        <Image
          src={logo}
          alt={lenderName}
          width={60}
          height={24}
          className="object-contain h-6 w-auto mb-2"
        />
      ) : (
        <div className="w-10 h-8 mb-2 flex items-center justify-center bg-gray-100 rounded-md">
          <span className="text-xs font-semibold text-gray-600">
            {getInitials(lenderName)}
          </span>
        </div>
      )}

      <span className="text-[12px] font-medium text-gray-700">{lenderName}</span>

      <span className="text-[11px] text-gray-500 mt-0.5">{statusLabel}</span>
    </div>
  );
};

/* ------------------ Section ------------------ */

export type UnmatchedOffersSectionProps = {
  /** Lenders with lenderStatus false and wcStatus REJECTED or NOT_PROCESSED */
  offers: LenderOfferStatus[];
};

/**
 * Displays explanatory content about unmatched offers with carousel of lenders
 */
export const UnmatchedOffersSection = ({ offers }: UnmatchedOffersSectionProps) => {
  const carouselLenders: CarouselLenderRow[] = useMemo(() => {
    const fromApi: CarouselLenderRow[] = offers.map((offer, index) => ({
      key: `api-${offer.lenderName ?? 'unknown'}-${index}`,
      lenderName: offer.lenderName?.trim() || 'Unknown lender',
      logo: offer.logo,
      // NOT_PROCESSED is surfaced with the same copy as REJECTED for inactive lenders
      statusLabel: 'Rejected',
    }));

    // const inactive: CarouselLenderRow[] = ALWAYS_SHOWN_INACTIVE_LENDERS.map((lender, index) => ({
    //   key: `static-${lender.name}-${index}`,
    //   lenderName: lender.name,
    //   logo: lender.logo,
    //   statusLabel: 'Not Eligible',
    // }));

    // return [...fromApi, ...inactive];
    return fromApi;
  }, [offers]);

  return (
    <section className="rounded-[8px] bg-brand-lightest-from pb-4 mb-25 ">
      <h3 className="text-[18px] font-light text-gray-800 mb-3 px-4 pt-4">
        Unmatched Offers
      </h3>

      <ul className="list-disc pl-5 space-y-1 mb-5 ml-4 mr-4">
        {UNMATCHED_REASONS.map((reason, index) => (
          <li
            key={index}
            className="font-manrope text-[12px] font-light leading-[120%] tracking-[0] text-gray-500"
          >
            {reason}
          </li>
        ))}
      </ul>

      <Carousel options={{ loop: false, align: 'center' }}>
        <CarouselContent>
          {carouselLenders.map((lender, index) => (
            <CarouselSlide
              key={lender.key}
              index={index}
              className={`basis-full ${CAROUSEL_SLIDE_PADDING}`}
            >
              <UnmatchedLenderCard
                lenderName={lender.lenderName}
                logo={lender.logo}
                statusLabel={lender.statusLabel}
              />
            </CarouselSlide>
          ))}
        </CarouselContent>

        <CarouselDots
          className={`flex items-center justify-center ${DOT_GAP} mt-4`}
          dotClassName={`${DOT_SIZE} rounded-full bg-white transition-all duration-200`}
          activeDotClassName={`${ACTIVE_DOT_SIZE} bg-brand-primary`}
        />
      </Carousel>
    </section>
  );
};
