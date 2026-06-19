'use client';

/**
 * Before Applying Section Component
 * Horizontally scrollable carousel of tips before applying for a loan
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
} from '@/components/ui/carousel';
import { BEFORE_APPLYING_TIPS, BEFORE_APPLYING_INFO, TipCardItem } from './constants';

/** Tip card props */
interface TipCardProps {
  tip: TipCardItem;
  index: number;
}

/**
 * Individual tip card with gradient background
 */
const TipCard = ({ tip, index }: TipCardProps): JSX.Element => {
  return (
    <motion.div
      className="h-40 bg-brand-lightest rounded-sm overflow-hidden p-2 md:h-[210px] md:rounded-md md:bg-gradient-to-br md:from-[#cfe1fb] md:to-white md:p-5"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <p className="text-gray-700 text-sm font-normal leading-5 md:text-lg md:leading-6 md:text-[#2f3338]">
        {tip.title}
      </p>
      <p className="text-gray-500 text-sm font-normal leading-5 mt-1 md:mt-4 md:text-base md:leading-6">
        {tip.description}
      </p>
    </motion.div>
  );
};

/**
 * Before Applying Section
 * Displays horizontally scrollable tip cards
 */
const BeforeApplyingSection = (): JSX.Element => {
  return (
    <section className="py-6 overflow-hidden md:px-0 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-6 px-4 md:mb-10 md:text-[32px] md:font-semibold md:leading-tight md:text-[#303236]">
          {BEFORE_APPLYING_INFO.title}
        </h2>

        {/* Carousel */}
        <Carousel options={{ align: 'start', containScroll: 'trimSnaps' }} className="md:hidden">
          <CarouselContent className="pl-4 max-w-3xl">
            {BEFORE_APPLYING_TIPS.map((tip, index) => (
              <CarouselSlide
                key={tip.id}
                index={index}
                className="flex-[0_0_72%] pr-4"
              >
                <TipCard tip={tip} index={index} />
              </CarouselSlide>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="hidden md:mx-auto md:grid md:max-w-7xl md:grid-cols-3 md:gap-5 md:px-4 lg:px-8 xl:px-0">
          {BEFORE_APPLYING_TIPS.map((tip, index) => (
            <TipCard key={tip.id} tip={tip} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BeforeApplyingSection;
