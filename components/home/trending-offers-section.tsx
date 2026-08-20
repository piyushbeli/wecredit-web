'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrendingOfferCard from './trending-offer-card';
import type { ActiveLender } from '@/lib/utils/lenders';
import { cn } from '@/lib/utils';
import { formatToTwoDecimals } from '@/lib/utils/common-helper';
import { formatTrendingOfferTenure } from '@/lib/lender-display';

interface TrendingOffersSectionProps {
  activeLenders: ActiveLender[];
  heading?: string;
}

const LENDERS_PER_COLUMN = 3;

/** Group items into columns */
function groupIntoColumns<T>(items: T[], itemsPerColumn: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerColumn) {
    columns.push(items.slice(i, i + itemsPerColumn));
  }
  return columns;
}

/**
 * Keep slides slightly narrower on mobile so the next slide peeks.
 */
function getSlideClassName(totalColumns: number): string {
  const isSingle = totalColumns === 1;

  return cn(
    'snap-start shrink-0',
    isSingle
      ? 'w-full'
      : 'w-[85%] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4',
    'px-2'
  );
}

function getChildScrollLeft(container: HTMLElement, child: HTMLElement): number {
  return (
    child.getBoundingClientRect().left -
    container.getBoundingClientRect().left +
    container.scrollLeft
  );
}

const TrendingOffersSection = ({
  activeLenders,
  heading,
}: TrendingOffersSectionProps): React.ReactNode => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const lenderColumns = groupIntoColumns(activeLenders, LENDERS_PER_COLUMN);

  const updateScrollState = useCallback((): void => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollPrev(container.scrollLeft > 2);
    setCanScrollNext(container.scrollLeft < maxScrollLeft - 2);
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) {
      return;
    }
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    children.forEach((child, index) => {
      const distance = Math.abs(getChildScrollLeft(container, child) - container.scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    setSelectedIndex(nearestIndex);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setSkipAnimation(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    resizeObserver.observe(container);
    return () => {
      container.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, lenderColumns.length]);

  const scrollToIndex = useCallback((index: number): void => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) {
      return;
    }
    container.scrollTo({
      left: getChildScrollLeft(container, child),
      behavior: 'smooth',
    });
  }, []);

  const handleScrollPrev = useCallback((): void => {
    scrollToIndex(Math.max(0, selectedIndex - 1));
  }, [scrollToIndex, selectedIndex]);

  const handleScrollNext = useCallback((): void => {
    scrollToIndex(Math.min(lenderColumns.length - 1, selectedIndex + 1));
  }, [scrollToIndex, selectedIndex, lenderColumns.length]);

  if (activeLenders.length === 0) return null;

  const showControls = lenderColumns.length > 1;

  let controls: React.ReactNode = null;
  if (showControls) {
    controls = (
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous trending offers"
          onClick={handleScrollPrev}
          disabled={!canScrollPrev}
          className="hidden sm:inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
        <div className="flex justify-center gap-2">
          {lenderColumns.map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors bg-gray-300',
                  isActive && 'bg-wc-blue-500'
                )}
              />
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Next trending offers"
          onClick={handleScrollNext}
          disabled={!canScrollNext}
          className="hidden sm:inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      </div>
    );
  }

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

        <div className="pl-2 xl:pl-0">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
          >
            {lenderColumns.map((column, colIndex) => (
              <div
                key={colIndex}
                className={getSlideClassName(lenderColumns.length)}
              >
                <div className="flex flex-col gap-2">
                  {column.map(({ id, lender }, rowIndex) => (
                    <TrendingOfferCard
                      key={id}
                      id={id}
                      lenderName={lender.Name || id}
                      logoPath={lender.logo || undefined}
                      badge="Fast Disbursal"
                      topColour={lender.topColour}
                      amount={lender.UptoAmount || 'N/A'}
                      interestRate={
                        lender.IntRate ? `${formatToTwoDecimals(lender.IntRate)}%` : 'N/A'
                      }
                      tenure={formatTrendingOfferTenure(lender.Tenure, lender.isPayday)}
                      href={lender.utmLink || `/offers/${id}`}
                      index={colIndex * LENDERS_PER_COLUMN + rowIndex}
                      skipAnimation={skipAnimation}
                      lenderType={lender?.lenderType || null}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {controls}
        </div>
      </div>
    </section>
  );
};

export default TrendingOffersSection;
