'use client';

/**
 * How We Work Section Component
 * Explains the personal loan matching process
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { HOW_WE_WORK_INFO } from './constants';

/**
 * How We Work Section
 * Displays explanation of how the PL engine matches lenders
 */
const HowWeWorkSection = (): JSX.Element => {
  return (
    <section className="py-6 px-4 md:px-0 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-4 md:mb-8 md:text-[32px] md:font-semibold md:leading-tight md:text-[#303236]">
          {HOW_WE_WORK_INFO.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-5 md:text-xl md:leading-8">{HOW_WE_WORK_INFO.description}</p>
      </motion.div>
    </section>
  );
};

export default HowWeWorkSection;
