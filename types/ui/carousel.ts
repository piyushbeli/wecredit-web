import type { UseEmblaCarouselType } from 'embla-carousel-react';
import type useEmblaCarousel from 'embla-carousel-react';

/** Embla carousel types */
export type EmblaCarouselType = UseEmblaCarouselType[1];
export type EmblaOptionsType = Parameters<typeof useEmblaCarousel>[0];
export type EmblaPluginType = Parameters<typeof useEmblaCarousel>[1];

/** Carousel API exposed to consumers */
export interface CarouselApi {
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

/** Carousel context value */
export interface CarouselContextValue extends CarouselApi {
  emblaRef: React.RefCallback<HTMLElement>;
  emblaApi: EmblaCarouselType | undefined;
}

/** Carousel root component props */
export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType;
  children: React.ReactNode | ((api: CarouselApi) => React.ReactNode);
}

/** CarouselContent props */
export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
}

/** CarouselSlide props */
export interface CarouselSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
}

/** CarouselDots props */
export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  dotClassName?: string;
  activeDotClassName?: string;
  renderDot?: (index: number, isActive: boolean) => React.ReactNode;
}

