import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
  useCarousel,
} from '@/components/ui/carousel';

/**
 * Skeleton component for trending offer card
 * Matches the structure and layout of TrendingOfferCard
 */
const TrendingOfferCardSkeleton = (): React.ReactNode => {
  return (
    <div className="w-full h-full">
      {/* Outer white container */}
      <div className="relative rounded-3xl h-full overflow-hidden bg-white border border-gray-200">
        {/* Gradient content area */}
        <div className="relative p-3 pb-4 bg-gray-50">
          {/* Badge skeleton - positioned at top right */}
          <div className="absolute right-0 top-4">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Header: Logo skeleton */}
          <div className="flex items-center mb-1">
            <Skeleton className="h-5 w-24 rounded" />
          </div>

          {/* Amount skeleton */}
          <Skeleton className="h-4 w-32 mb-1 rounded" />

          {/* Rate & Tenure skeleton - With icon placeholders */}
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        </div>

        {/* CTA Button skeleton */}
        <div className="p-2 bg-white">
          <Skeleton className="h-8 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton component for trending offers section
 * Matches the structure of TrendingOffersSection with carousel layout
 */
const TrendingOffersSkeleton = (): React.ReactNode => {
  // Create skeleton columns (2-3 columns to show carousel structure)
  const skeletonColumns = 3;
  const cardsPerColumn = 2;

  const TrendingCarouselArrowsSkeleton = (): React.ReactNode => {
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
          activeDotClassName="bg-gray-400"
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

  return (
    <section className="bg-white py-8">
      <div className="px-4">
        {/* Section Title Skeleton */}
        <Skeleton className="h-7 w-40 mb-6 rounded" />
      </div>

      {/* Lender Carousel Skeleton */}
      <Carousel options={{ loop: false, align: 'start', slidesToScroll: 1 }} className="px-4">
        <CarouselContent className="-ml-3">
          {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
            <CarouselSlide
              key={colIndex}
              index={colIndex}
              className="basis-4/5 pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
            >
              {/* 2-row vertical stack */}
              <div className="flex flex-col gap-3">
                {Array.from({ length: cardsPerColumn }).map((_, rowIndex) => (
                  <TrendingOfferCardSkeleton key={rowIndex} />
                ))}
              </div>
            </CarouselSlide>
          ))}
        </CarouselContent>
        <TrendingCarouselArrowsSkeleton />
      </Carousel>
    </section>
  );
};

export default TrendingOffersSkeleton;
