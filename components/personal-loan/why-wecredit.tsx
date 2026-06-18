'use client';

/**
 * Why WeCredit Component
 * Displays benefits grid explaining why users should choose WeCredit
 * Simplified 2x2 grid with gradient cards
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { WHY_WECREDIT_SIMPLE, WhyWeCreditSimpleItem } from './constants';

/** Benefit card props */
interface BenefitCardProps {
  benefit: WhyWeCreditSimpleItem;
  index: number;
}

/**
 * Individual benefit card with gradient background
 */
const BenefitCard = ({ benefit, index }: BenefitCardProps): JSX.Element => {
  return (
    <motion.div
      className="h-16 bg-brand-lightest rounded shadow-sm overflow-hidden md:h-32 md:rounded-md md:bg-gradient-to-br md:from-[#cfe1fb] md:to-white md:shadow-none"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="p-2 md:p-4">
        <p className="text-sm font-normal text-gray-700 md:text-2xl md:leading-8 md:text-[#2f3338]">{benefit.text}</p>
      </div>
    </motion.div>
  );
};

/**
 * Why WeCredit Section
 * 2x2 grid of benefit cards showcasing WeCredit's advantages
 */
const WhyWeCredit = (): JSX.Element => {
  return (
    <section className="py-6 px-4 md:px-0 md:py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-6 md:mb-10 md:text-[36px] md:font-semibold md:leading-tight md:text-[#303236]">
          Why Choose WeCredit
        </h2>

        {/* Benefits Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {WHY_WECREDIT_SIMPLE.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyWeCredit;
