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
import type { ActiveLender } from '@/lib/utils/lenders';

/** Props for TrendingOffersSection component */
interface TrendingOffersSectionProps {
  activeLenders: ActiveLender[];
}

/** Group items into columns of N for vertical stacking */
function groupIntoColumns<T>(items: T[], rowsPerColumn: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += rowsPerColumn) {
    columns.push(items.slice(i, i + rowsPerColumn));
  }
  return columns;
}

/**
 * Trending Offers section component
 * Displays a responsive carousel with 3-row columns
 * Receives pre-fetched lender data from server
 */
const TrendingOffersSection = ({ activeLenders }: TrendingOffersSectionProps): React.ReactNode => {
  const lenderColumns = groupIntoColumns(activeLenders, 3);

  if (activeLenders.length === 0) {
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

      {/* Lender Carousel */}
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
    </section>
  );
};

export default TrendingOffersSection;
