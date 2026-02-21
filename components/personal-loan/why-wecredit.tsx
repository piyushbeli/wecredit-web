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
      className="h-16 bg-brand-lightest rounded shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="p-2">
        <p className="text-sm font-normal text-gray-700">{benefit.text}</p>
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
    <section className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-6">
          Why Choose WeCredit
        </h2>

        {/* Benefits Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {WHY_WECREDIT_SIMPLE.map((benefit, index) => (
            <BenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyWeCredit;
