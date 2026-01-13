import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
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
  const cardsPerColumn = 3;

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
              className="basis-4/5 pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              {/* 3-row vertical stack */}
              <div className="flex flex-col gap-3">
                {Array.from({ length: cardsPerColumn }).map((_, rowIndex) => (
                  <TrendingOfferCardSkeleton key={rowIndex} />
                ))}
              </div>
            </CarouselSlide>
          ))}
        </CarouselContent>

        {/* Dot Indicators Skeleton */}
        <CarouselDots
          className="mt-4"
          dotClassName="w-2 h-2 rounded-full transition-colors bg-gray-300"
          activeDotClassName="bg-gray-400"
        />
      </Carousel>
    </section>
  );
};

export default TrendingOffersSkeleton;
