'use client';

/**
 * UnmatchedOffersSection Component
 * 
 * Displays Static inactive lenders on Affiliate
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
  { name: "PREFR", logo: "https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/prefr-1.png" },
  { name: "UNITY", logo: "https://wcstaticasset.blob.core.windows.net/assets/unity_logo.png" },
  { name: "KREDITO", logo: "https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/kredito.jpeg" },
  { name: "ABFL BL", logo: "https://wcstaticasset.blob.core.windows.net/assets/abcf_logo.png" },
  { name: "ABFL", logo: "https://wcstaticasset.blob.core.windows.net/assets/abcf_logo.png" },
  { name: "BRANCH", logo: "https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/unnamed.jpg" },
  { name: "INSTAMONEY", logo: "https://wcstaticasset.blob.core.windows.net/assets/InstaMoney-Logo.png" },
] as const;

// Carousel styling constants
const CAROUSEL_SLIDE_PADDING = 'px-10';
const DOT_SIZE = 'w-[6px] h-[6px]';
const ACTIVE_DOT_SIZE = '!w-[8px] !h-[8px]';
const DOT_GAP = 'gap-[2px]';

/* ------------------ Lender Card ------------------ */

/**
 * Individual lender card component
 * Shows logo (or fallback initials), lender name, and "Not Eligible" status
 */
const UnmatchedLenderCard = ({lenderName,logo,}: {lenderName: string;logo?: string;}) => {
  // Enhanced fallback: Show first two letters as initials if no logo
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

      <span className="text-[11px] text-gray-500 mt-0.5">Not Eligible</span>
    </div>
  );
};

/* ------------------ Section ------------------ */

/**
 * Displays explanatory content about unmatched offers with carousel of inactive lenders
 */
export const UnmatchedOffersSection = () => {
  const offers = useOfferStore((state) => state.offers);
  const allUnmatchedLenders = useMemo(() => {
    const inactive = ALWAYS_SHOWN_INACTIVE_LENDERS.map((lender) => ({
      lenderName: lender.name,
      logo: lender.logo,
    }));

    return [...inactive];
  }, []);

  return (
    <section className="rounded-[8px] bg-[#CCDFFC] pb-4 mb-25 ">
      {/* Title */}
      <h3 className="text-[18px] font-light text-gray-800 mb-3 px-4 pt-4">
        Unmatched Offers
      </h3>

      {/* Reasons */}
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


      {/* Lender Carousel - Display inactive lenders */}
      <Carousel options={{ loop: false, align: 'center' }}>
        <CarouselContent>
          {allUnmatchedLenders.map((lender, index) => (
            <CarouselSlide
              key={`${lender.lenderName}-${index}`}
              index={index}
              className={`basis-full ${CAROUSEL_SLIDE_PADDING}`}
            >
              <UnmatchedLenderCard
                lenderName={lender.lenderName}
                logo={lender.logo}
              />
            </CarouselSlide>
          ))}
        </CarouselContent>

        {/* Pagination Dots */}
        <CarouselDots
          className={`flex items-center justify-center ${DOT_GAP} mt-4`}
          dotClassName={`${DOT_SIZE} rounded-full bg-white transition-all duration-200`}
          activeDotClassName={`${ACTIVE_DOT_SIZE} bg-[#045BCF]`}
        />

      </Carousel>
    </section>
  );
};
