'use client';

/**
 * UnmatchedOffersSection Component
 *
 * Static informational section explaining why some lenders may not show offers.
 * Displays explanatory bullet points and a carousel of unmatched lenders.
 */

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';

/** Unmatched lender data */
interface UnmatchedLender {
  name: string;
  logo: string;
}

/** Static list of unmatched lenders */
const UNMATCHED_LENDERS: UnmatchedLender[] = [
  {
    name: 'UNITY',
    logo: 'https://wcstaticasset.blob.core.windows.net/assets/unity_logo.png',
  },
  {
    name: 'KREDITO',
    logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/kredito.jpeg',
  },
  {
    name: 'ABFL BL',
    logo: 'https://wcstaticasset.blob.core.windows.net/assets/abcf_logo.png',
  },
  {
    name: 'ABFL',
    logo: 'https://wcstaticasset.blob.core.windows.net/assets/abcf_logo.png',
  },
  {
    name: 'PREFR',
    logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/prefr-1.png',
  },
  {
    name: 'BRANCH',
    logo: 'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/unnamed.jpg',
  },
  {
    name: 'INSTAMONEY',
    logo: 'https://wcstaticasset.blob.core.windows.net/assets/InstaMoney-Logo.png',
  },
];

const UNMATCHED_REASONS = [
  "You don't meet the lenders eligibility criteria.",
  "Your location isn't currently serviceable by the lender.",
  'You already have an ongoing loan or recent application with this lender.',
] as const;

/**
 * Individual lender card showing "Not Eligible" status
 */
const UnmatchedLenderCard = ({ lender }: { lender: UnmatchedLender }) => {
  return (
    <div className="bg-white rounded-md p-3 flex flex-col items-center justify-center min-h-[60px]">
      <Image
        src={lender.logo}
        alt={lender.name}
        width={34}
        height={15}
        className="object-contain h-4 w-auto mb-1"
      />
      <span className="text-[10px] text-gray-500 font-normal">{lender.name}</span>
      <span className="text-[10px] text-gray-500 font-normal">Not Eligible</span>
    </div>
  );
};

/**
 * Displays explanatory content about unmatched offers with lender carousel
 */
export const UnmatchedOffersSection = () => {
  return (
    <section
      className="rounded-lg p-4 overflow-hidden"
      style={{ backgroundColor: '#CCDFFC' }}
    >
      {/* Title */}
      <h3
        className="text-base font-medium mb-2"
        style={{ color: '#303030', fontFamily: 'DM Sans, sans-serif' }}
      >
        Unmatched Offers
      </h3>

      {/* Reasons list */}
      <ul className="space-y-0.5 mb-4">
        {UNMATCHED_REASONS.map((reason, index) => (
          <li
            key={index}
            className="text-xs leading-snug flex items-start gap-1"
            style={{ color: '#7F7F7F' }}
          >
            <span>•</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>

      {/* Lender Carousel */}
      <Carousel options={{ loop: false, align: 'center' }}>
        <CarouselContent className="-ml-2">
          {UNMATCHED_LENDERS.map((lender, index) => (
            <CarouselSlide
              key={lender.name}
              index={index}
              className="basis-full pl-2"
            >
              <UnmatchedLenderCard lender={lender} />
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
