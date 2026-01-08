'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TrendingOfferCard from './trending-offer-card';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';
import { useActiveLenders, type ActiveLender } from '@/hooks/use-active-lenders';
import { env } from '@/lib/config';

/** Props for TrendingOffersSection component */
interface TrendingOffersSectionProps {
  /** Optional mobile number for API header */
  mobile?: string;
}

/** Group items into columns of N for vertical stacking */
function groupIntoColumns<T>(items: T[], rowsPerColumn: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += rowsPerColumn) {
    columns.push(items.slice(i, i + rowsPerColumn));
  }
  return columns;
}

/** Loading skeleton for offer card */
const OfferCardSkeleton = (): React.ReactNode => (
  <div className="w-full animate-pulse">
    <div className="rounded-3xl h-[140px] bg-gray-100 border border-gray-200" />
  </div>
);

/** Loading skeleton column */
const SkeletonColumn = (): React.ReactNode => (
  <div className="flex flex-col gap-3">
    <OfferCardSkeleton />
    <OfferCardSkeleton />
    <OfferCardSkeleton />
  </div>
);

/**
 * Trending Offers section component
 * Displays a responsive carousel with 3-row columns
 * Fetches data from WeCredit API with fallback to static data
 */
const TrendingOffersSection = ({ mobile }: TrendingOffersSectionProps): React.ReactNode => {
  const { isLoading, error, getActiveLenders } = useActiveLenders({ mobile });

  const activeLenders = getActiveLenders();
  const displayLenders = activeLenders.length > 0 ? activeLenders : [];
  const lenderColumns = groupIntoColumns(displayLenders, 3);


  if (displayLenders.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8">
      <div className="px-4">
        {/* Section Title */}
        <motion.h2
          className="text-lg font-semibold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Trending Offers
        </motion.h2>
      </div>

      {isLoading ? (
        <div className="px-4">
          <div className="flex gap-3 overflow-hidden">
            <div className="basis-4/5 shrink-0 md:basis-1/3 lg:basis-1/4">
              <SkeletonColumn />
            </div>
            <div className="basis-4/5 shrink-0 md:basis-1/3 lg:basis-1/4">
              <SkeletonColumn />
            </div>
          </div>
        </div>
      ) : (
        <Carousel options={{ loop: true, align: 'start', slidesToScroll: 1 }} className="px-4">
          <CarouselContent className="-ml-3">
            {lenderColumns.map((column, colIndex) => (
              <CarouselSlide
                key={colIndex}
                index={colIndex}
                className="basis-4/5 pl-3 md:basis-1/3 lg:basis-1/4"
              >
                {/* 3-row vertical stack */}
                <div className="flex flex-col gap-3">
                  {column.map(({ id, lender }, rowIndex) => (
                    <TrendingOfferCard
                      key={id}
                      id={id}
                      lenderName={lender.Name || id}
                      logoPath={lender.logo || undefined}
                      badge="Fast Disbursal"
                      amount={lender.UptoAmount || 'N/A'}
                      interestRate={lender.IntRate ? `${lender.IntRate}%` : 'N/A'}
                      tenure={lender.Tenure ? `${lender.Tenure} m` : 'N/A'}
                      href={lender.utmLink || `/offers/${id}`}
                      index={colIndex * 3 + rowIndex}
                    />
                  ))}
                </div>
              </CarouselSlide>
            ))}
          </CarouselContent>

          {/* Dot Indicators */}
          <CarouselDots
            className="mt-4"
            dotClassName="w-2 h-2 rounded-full transition-colors bg-gray-300"
            activeDotClassName="bg-wc-blue-500"
          />
        </Carousel>
      )}

      {/* Error indicator (only in development) */}
      {error && env.isDevelopment && (
        <p className="px-4 text-xs text-red-500 mt-2">
          API Error: {error.message} (using fallback data)
        </p>
      )}
    </section>
  );
};

export default TrendingOffersSection;
