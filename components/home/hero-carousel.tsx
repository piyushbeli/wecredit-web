'use client';

import { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselSlide, CarouselDots } from '@/components/ui/carousel';

/** Slide content configuration */
interface SlideContent {
  id: string;
  image: string;
  titleWhite: string;
  titleGradient: string;
  ctaText: string;
  ctaLink: string;
}

/** Carousel slides data */
const slides: SlideContent[] = [
  {
    id: 'slide-1',
    image: '/images/carousel-one.png',
    titleWhite: 'More Savings',
    titleGradient: 'on Every Loan',
    ctaText: 'Apply For Loan',
    ctaLink: '#',
  },
  {
    id: 'slide-2',
    image: '/images/carousel-two.png',
    titleWhite: 'More Savings',
    titleGradient: 'on Every Loan',
    ctaText: 'Get Your Card',
    ctaLink: '#',
  },
  {
    id: 'slide-3',
    image: '/images/carousel-three.png',
    titleWhite: 'More Savings',
    titleGradient: 'on Every Loan',
    ctaText: 'Check Eligibility',
    ctaLink: '#',
  },
];

/**
 * Hero carousel section with gradient background, 3D avatar, and swipeable slides
 */
const HeroCarousel = (): JSX.Element => {
  return (
    <section className="wc-hero-bg min-h-[40vh] relative pt-16">
      <Carousel
        options={{ loop: true, align: 'center' }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="relative z-10 h-full flex flex-col"
      >
        <CarouselContent className="flex-1">
          {slides.map((slide) => (
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
                <h1 className="text-3xl font-bold mb-1">{slide.titleWhite}</h1>
                <p className="text-3xl font-bold wc-gradient-text">{slide.titleGradient}</p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-wc-blue-500 hover:bg-wc-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-wc-blue-500/30 transition-all duration-300 active:scale-95"
                >
                  {slide.ctaText}
                </Link>
              </motion.div>
            </CarouselSlide>
          ))}
        </CarouselContent>

        {/* Dot Indicators - positioned below the carousel content */}
        <CarouselDots className="py-8 z-20" />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
