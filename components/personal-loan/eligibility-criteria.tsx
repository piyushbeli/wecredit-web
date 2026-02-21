'use client';

/**
 * Eligibility Criteria Component
 * Displays personal loan eligibility requirements with hourglass icons
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';
import { ELIGIBILITY_CRITERIA, ELIGIBILITY_SECTION_INFO, EligibilityItem } from './constants';
import { IMAGES } from '@/lib/constants/images';
import Image from 'next/image';

/** Eligibility item card props */
interface EligibilityCardProps {
  item: EligibilityItem;
  index: number;
}

/**
 * Individual eligibility criteria card with hourglass icon
 */
const EligibilityCard = ({ item, index }: EligibilityCardProps): JSX.Element => {
  return (
    <motion.div
      className="flex items-center justify-center gap-3 p-2 bg-white rounded-lg shadow border border-gray-50"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Icon Container */}
      <div className="w-9 h-9 bg-wc-blue-100 rounded flex items-center justify-center shrink-0">
        <Image src={IMAGES.ICONS.HOURGLASS} alt="Hourglass Icon" width={24} height={24} className="w-5 h-5" />
      </div>
      {/* Text Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm leading-5">
          <span className="font-medium text-gray-700">{item.title} </span>
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
    <section className="py-6 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Container with dashed border and corner brackets */}
        <div className="relative">

          {/* Section Title */}
          <h2 className="text-base font-medium text-center text-gray-900 mb-2">
            {ELIGIBILITY_SECTION_INFO.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 text-center mb-6 leading-5">
            {ELIGIBILITY_SECTION_INFO.description}
          </p>

          {/* Eligibility Cards - Vertical Stack */}
          <div className="space-y-2">
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
