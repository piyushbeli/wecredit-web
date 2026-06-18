'use client';

/**
 * Interest Rates Info Component
 * Displays personal loan interest rates information text section
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { INTEREST_RATES_INFO } from './constants';

/**
 * Interest Rates Info Section
 * Simple text section explaining personal loan interest rates
 */
const InterestRatesInfo = (): JSX.Element => {
  return (
    <section className="py-6 px-4 md:px-0 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-4 md:mb-10 md:text-[36px] md:font-semibold md:leading-tight md:text-[#303236]">
          {INTEREST_RATES_INFO.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-5 md:text-[22px] md:leading-8">
          {INTEREST_RATES_INFO.description}
        </p>
      </motion.div>
    </section>
  );
};

export default InterestRatesInfo;
