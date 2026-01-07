'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import type {
  CarouselApi,
  CarouselContextValue,
  CarouselProps,
  CarouselContentProps,
  CarouselSlideProps,
  CarouselDotsProps,
  EmblaOptionsType,
  EmblaPluginType,
} from '@/types/ui/carousel';

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

/**
 * Hook to access carousel context
 * Must be used within a Carousel component
 */
const useCarousel = (): CarouselContextValue => {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a Carousel component');
  }
  return context;
};

/**
 * Root carousel component
 * Provides carousel context and initializes Embla
 */
const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ options, plugins, children, className, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const scrollTo = React.useCallback(
      (index: number) => {
        emblaApi?.scrollTo(index);
      },
      [emblaApi]
    );

    const scrollPrev = React.useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
      };
    }, [emblaApi, onSelect]);

    const contextValue: CarouselContextValue = React.useMemo(
      () => ({
        emblaRef,
        emblaApi,
        selectedIndex,
        scrollSnaps,
        scrollTo,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }),
      [
        emblaRef,
        emblaApi,
        selectedIndex,
        scrollSnaps,
        scrollTo,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      ]
    );

    const api: CarouselApi = {
      selectedIndex,
      scrollSnaps,
      scrollTo,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    };

    return (
      <CarouselContext.Provider value={contextValue}>
        <div ref={ref} className={cn('relative', className)} {...props}>
          {typeof children === 'function' ? children(api) : children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

/**
 * Carousel content container
 * Wraps slides and applies emblaRef
 */
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, containerClassName, children, ...props }, ref) => {
    const { emblaRef } = useCarousel();

    return (
      <div ref={emblaRef} className={cn('overflow-hidden', containerClassName)}>
        <div ref={ref} className={cn('flex', className)} {...props}>
          {children}
        </div>
      </div>
    );
  }
);
CarouselContent.displayName = 'CarouselContent';

/**
 * Individual carousel slide
 * Provides slide index via data attribute
 */
const CarouselSlide = React.forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ className, index, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slide-index={index}
        className={cn('min-w-0 shrink-0 grow-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CarouselSlide.displayName = 'CarouselSlide';

/**
 * Carousel dot indicators
 * Supports custom styling and custom dot rendering
 */
const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  (
    {
      className,
      dotClassName = 'wc-dot',
      activeDotClassName = 'wc-dot-active',
      renderDot,
      ...props
    },
    ref
  ) => {
    const { selectedIndex, scrollSnaps, scrollTo } = useCarousel();

    if (scrollSnaps.length <= 1) return null;

    return (
      <div ref={ref} className={cn('flex justify-center gap-2', className)} {...props}>
        {scrollSnaps.map((_, index) => {
          const isActive = index === selectedIndex;
          if (renderDot) {
            return (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {renderDot(index, isActive)}
              </button>
            );
          }
          return (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(dotClassName, isActive && activeDotClassName)}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    );
  }
);
CarouselDots.displayName = 'CarouselDots';

export {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
  useCarousel,
  type CarouselProps,
  type CarouselApi,
  type EmblaOptionsType,
  type EmblaPluginType,
};
