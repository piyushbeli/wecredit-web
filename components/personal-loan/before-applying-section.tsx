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
      className="h-40 bg-brand-lightest rounded-sm overflow-hidden p-2"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <p className="text-gray-700 text-sm font-normal leading-5">
        {tip.title}
      </p>
      <p className="text-gray-500 text-sm font-normal leading-5 mt-1">
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
    <section className="py-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-6 px-4">
          {BEFORE_APPLYING_INFO.title}
        </h2>

        {/* Carousel */}
        <Carousel options={{ align: 'start', containScroll: 'trimSnaps' }}>
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
      </motion.div>
    </section>
  );
};

export default BeforeApplyingSection;
