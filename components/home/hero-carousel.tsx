'use client';

import { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselSlide, CarouselDots } from '@/components/ui/carousel';
import { ActionButton } from '@/components/shared';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { HERO_CAROUSEL_SLIDES } from '@/lib/constants/common';
import type { MouseEvent } from 'react';
/** Slide content configuration */
export interface SlideContent {
  id: string;
  image: string;
  titleWhite: string;
  titleGradient: string;
  ctaText: string;
  ctaLink: string;
}


/**
 * Hero carousel section with gradient background, 3D avatar, and swipeable slides
 */
const HeroCarousel = (): JSX.Element => {
  const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

  const renderCtaElement = (slide: SlideContent) => {
  const isPersonalLoan = slide.ctaLink === '/personal-loan';

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isPersonalLoan) {
      e.preventDefault(); // stop navigation
      triggerApplyFlow(); // trigger apply flow instead
    }
  };

  return (
    <Link
      href={slide.ctaLink}
      onClick={handleClick}
      className="inline-flex items-center justify-center px-8 py-4 bg-wc-blue-500 hover:bg-wc-blue-600 text-white rounded-lg transition-all duration-300 active:scale-95"
    >
      {slide.ctaText}
    </Link>
  );
};

  return (
    <section className="wc-hero-bg min-h-[40vh] relative pt-16">
      <Carousel
        options={{ loop: true, align: 'center' }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="relative z-10 h-full flex flex-col"
      >
        <CarouselContent className="flex-1">
          {HERO_CAROUSEL_SLIDES.map((slide) => {
            // Keep the CTA flow consistent with the personal loan page apply button.
            const ctaElement = renderCtaElement(slide);

            return (
              <CarouselSlide
                key={slide.id}
                className="flex-[0_0_100%] flex flex-col items-center justify-center px-6 pt-8"
              >
                {/* 3D Hero Avatar with Floating Elements */}
                <motion.div
                  className="relative w-96 h-40 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
                >
                  <Image
                    src={slide.image}
                    alt="WeCredit Hero"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Title */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h1 className="text-3xl font-medium mb-1">{slide.titleWhite}</h1>
                  <p className="text-3xl font-medium text-blue-primary">{slide.titleGradient}</p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {ctaElement}
                </motion.div>
              </CarouselSlide>
            );
          })}
        </CarouselContent>

        {/* Dot Indicators - positioned below the carousel content */}
        <CarouselDots className="py-8 z-20" />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
