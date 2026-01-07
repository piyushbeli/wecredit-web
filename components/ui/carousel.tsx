'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { cn } from '@/lib/utils';

/** Embla carousel types */
type EmblaCarouselType = UseEmblaCarouselType[1];
type EmblaOptionsType = Parameters<typeof useEmblaCarousel>[0];
type EmblaPluginType = Parameters<typeof useEmblaCarousel>[1];

/** Carousel API exposed to consumers */
interface CarouselApi {
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

/** Carousel context value */
interface CarouselContextValue extends CarouselApi {
  emblaRef: React.RefCallback<HTMLElement>;
  emblaApi: EmblaCarouselType | undefined;
}

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

/** Carousel root component props */
interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType;
  children: React.ReactNode | ((api: CarouselApi) => React.ReactNode);
}

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

/** CarouselContent props */
interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
}

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

/** CarouselSlide props */
interface CarouselSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
}

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

/** CarouselDots props */
interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  dotClassName?: string;
  activeDotClassName?: string;
  renderDot?: (index: number, isActive: boolean) => React.ReactNode;
}

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

