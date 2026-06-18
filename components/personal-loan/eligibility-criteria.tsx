'use client';

/**
 * Eligibility Criteria Component
 * Displays personal loan eligibility requirements with hourglass icons
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { ChartNoAxesColumnIncreasing, CreditCard, Hourglass, Landmark, WalletCards } from 'lucide-react';
import { ELIGIBILITY_CRITERIA, ELIGIBILITY_SECTION_INFO, EligibilityItem } from './constants';

const DESKTOP_ICONS = [Hourglass, WalletCards, CreditCard, Landmark, ChartNoAxesColumnIncreasing];

/** Eligibility item card props */
interface EligibilityCardProps {
  item: EligibilityItem;
  index: number;
}

/**
 * Individual eligibility criteria card with hourglass icon
 */
const EligibilityCard = ({ item, index }: EligibilityCardProps): JSX.Element => {
  const DesktopIcon = DESKTOP_ICONS[index] ?? Hourglass;

  return (
    <motion.div
      className="flex items-center justify-center gap-3 p-2 bg-white rounded-lg shadow border border-gray-50 md:justify-start md:gap-5 md:rounded-xl md:p-4 md:shadow-[0_2px_12px_rgba(0,0,0,0.10)]"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Icon Container */}
      <div className="w-9 h-9 bg-wc-blue-100 rounded flex items-center justify-center shrink-0 md:h-16 md:w-16 md:rounded-md">
        <DesktopIcon className="h-5 w-5 md:h-8 md:w-8 text-brand-primary" strokeWidth={1.8} />
      </div>
      {/* Text Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm leading-5 md:text-xl md:leading-8">
          <span className="font-medium text-gray-700 md:font-semibold">{item.title} </span>
          <span className="font-normal text-gray-500">{item.requirement}</span>
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Eligibility Criteria Section
 * Shows requirements for personal loan eligibility in a bordered container
 */
const EligibilityCriteria = (): JSX.Element => {
  return (
    <section className="py-6 px-4 md:px-0 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
      >
        {/* Container with dashed border and corner brackets */}
        <div className="relative">

          {/* Section Title */}
          <h2 className="text-base font-medium text-center text-gray-900 mb-2 md:text-left md:text-[32px] md:font-semibold md:leading-tight md:text-[#303236]">
            {ELIGIBILITY_SECTION_INFO.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 text-center mb-6 leading-5 md:mb-10 md:text-left md:text-xl md:leading-7">
            {ELIGIBILITY_SECTION_INFO.description}
          </p>

          {/* Eligibility Cards - Vertical Stack */}
          <div className="space-y-2 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
            {ELIGIBILITY_CRITERIA.map((item, index) => (
              <EligibilityCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default EligibilityCriteria;
