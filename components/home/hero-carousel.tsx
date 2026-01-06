'use client';

import { JSX, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';

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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="wc-hero-bg min-h-[85vh] relative pt-16">
      {/* Carousel */}
      <div className="relative z-10 h-full flex flex-col" ref={emblaRef}>
        <div className="flex flex-1">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-6 py-8"
            >
              {/* 3D Hero Avatar with Floating Elements */}
              <motion.div
                className="relative w-96 h-96 mb-4"
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
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => scrollTo(index)}
            className={`wc-dot ${index === selectedIndex ? 'wc-dot-active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

