'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TrendingOfferCard from './trending-offer-card';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { ActiveLender } from '@/lib/utils/lenders';

/** Props for TrendingOffersSection component */
interface TrendingOffersSectionProps {
  activeLenders: ActiveLender[];
  heading?: string;
}

/** Group items into columns of N for vertical stacking */
function groupIntoColumns<T>(items: T[], rowsPerColumn: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += rowsPerColumn) {
    columns.push(items.slice(i, i + rowsPerColumn));
  }
  return columns;
}

function getCarouselSlideClassName(
  columnIndex: number,
  totalColumns: number
): string {
  const isSingle = totalColumns === 1;

  return cn(
    isSingle
      ? 'basis-full'
      : 'basis-9/10 sm:basis-1/2 md:basis-1/3 lg:basis-1/4',
    isSingle ? 'px-4' : columnIndex===0 ? 'pl-4' : columnIndex===totalColumns-1 ? 'pl-3 pr-4' : 'pl-3 pr-0'  // spacing handled at slide level for proper snap sync
  );
}

const TrendingOffersSection = ({
  activeLenders,
  heading,
}: TrendingOffersSectionProps): React.ReactNode => {
  const [skipAnimation, setSkipAnimation] = useState(false);
  const lenderColumns = groupIntoColumns(activeLenders, 3);

  useEffect(() => {
    // Delay animation disabling so initial staggered motion doesn't replay on mount.
    const timeout = setTimeout(() => setSkipAnimation(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (activeLenders.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-4">
      <div className="px-4">
        {/* Section Title */}
        <motion.h2
          className="text-lg font-medium text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {heading || 'Trending Offers'}
        </motion.h2>
      </div>

      <Carousel
        options={{
          loop: false,
          align: lenderColumns.length === 1 ? 'center' : 'start',
          slidesToScroll: 1,
          containScroll: 'trimSnaps',
        }}
      >
        <CarouselContent>
          {lenderColumns.map((column, colIndex) => (
            <CarouselSlide
              key={colIndex}
              index={colIndex}
              className={getCarouselSlideClassName(
                colIndex,
                lenderColumns.length
              )}
            >
              <div className="flex flex-col gap-3">
                {column.map(({ id, lender }, rowIndex) => (
                  <TrendingOfferCard
                    key={id}
                    id={id}
                    lenderName={lender.Name || id}
                    logoPath={lender.logo || undefined}
                    badge="Fast Disbursal"
                    amount={lender.UptoAmount || 'N/A'}
                    interestRate={
                      lender.IntRate ? `${lender.IntRate}%` : 'N/A'
                    }
                    tenure={lender.Tenure ? `${lender.Tenure} m` : 'N/A'}
                    href={lender.utmLink || `/offers/${id}`}
                    index={colIndex * 3 + rowIndex}
                    skipAnimation={skipAnimation}
                  />
                ))}
              </div>
            </CarouselSlide>
          ))}
        </CarouselContent>

        { /* <CarouselDots
          className="mt-4"
          dotClassName="w-2 h-2 rounded-full transition-colors bg-gray-300"
          activeDotClassName="bg-wc-blue-500"
        /> */}
      </Carousel>
    </section>
  );
};

export default TrendingOffersSection;