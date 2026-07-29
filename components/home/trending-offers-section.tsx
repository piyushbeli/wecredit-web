'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrendingOfferCard from './trending-offer-card';
import type { ActiveLender } from '@/lib/utils/lenders';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
  useCarousel,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { formatToTwoDecimals } from '@/lib/utils/common-helper';

interface TrendingOffersSectionProps {
  activeLenders: ActiveLender[];
  heading?: string;
}

/** Group items into columns of 2 */
function groupIntoColumns<T>(items: T[], itemsPerColumn: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerColumn) {
    columns.push(items.slice(i, i + itemsPerColumn));
  }
  return columns;
}

/**
 * Key change:
 * We intentionally keep slides slightly narrower on mobile
 * so the next slide is partially visible (peek UX)
 */
function getCarouselSlideClassName(totalColumns: number): string {
  const isSingle = totalColumns === 1;

  return cn(
    isSingle
      ? 'basis-full'
      : 'basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4',
    'px-2'
  );
}

const TrendingCarouselControls = (): React.ReactNode => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      <button
        type="button"
        aria-label="Previous trending offers"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 text-gray-700" />
      </button>
      <CarouselDots
        className="mt-0"
        dotClassName="w-2 h-2 rounded-full transition-colors bg-gray-300"
        activeDotClassName="bg-wc-blue-500"
      />
      <button
        type="button"
        aria-label="Next trending offers"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4 text-gray-700" />
      </button>
    </div>
  );
};

const TrendingOffersSection = ({
  activeLenders,
  heading,
}: TrendingOffersSectionProps): React.ReactNode => {
  const pathname = usePathname();
  const [skipAnimation, setSkipAnimation] = useState(false);

  const lenderColumns = groupIntoColumns(activeLenders, 2);

  useEffect(() => {
    const timeout = setTimeout(() => setSkipAnimation(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (activeLenders.length === 0) return null;

  return (
    <section className="bg-white wc-section-gap w-full justify-center flex">
      <div className="w-full max-w-7xl">
        <motion.h2
          className="wc-section-heading text-gray-900"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {heading || 'Trending Offers'}
        </motion.h2>

        <Carousel
          key={`${pathname}-trending-offers`}
          options={{
            loop: false,
            align: 'start', // important for peek effect
            slidesToScroll: 1,
            containScroll: 'trimSnaps',
          }}
          className='pl-2 xl:pl-0'
        >

          <CarouselContent>
            {lenderColumns.map((column, colIndex) => (
              <CarouselSlide
                key={colIndex}
                index={colIndex}
                className={getCarouselSlideClassName(lenderColumns.length)}
              >
                <div className="flex flex-col gap-2">
                  {column.map(({ id, lender }, rowIndex) => (
          <TrendingOfferCard
                      key={id}
                      id={id}
                      lenderName={lender.Name || id}
                      logoPath={lender.logo || undefined}
                      badge="Fast Disbursal"
                      amount={lender.UptoAmount || 'N/A'}
                      interestRate={
                        lender.IntRate ? `${formatToTwoDecimals(lender.IntRate)}%` : 'N/A'
                      }
                      tenure={lender.Tenure ? `${lender.Tenure} m` : 'N/A'}
                      href={lender.utmLink || `/offers/${id}`}
                      index={colIndex * 2 + rowIndex}
                      skipAnimation={skipAnimation}
                      lenderType={lender?.lenderType || null}
                    />
                  ))}
                </div>
              </CarouselSlide>
            ))}
          </CarouselContent>
          <TrendingCarouselControls />
        </Carousel>
      </div >
    </section >
  );
};

export default TrendingOffersSection;