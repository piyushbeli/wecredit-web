'use client';

/**
 * After Closure Section Component
 * Checklist of things to do after loan closure
 */

import { JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { AFTER_CLOSURE_CHECKLIST, AFTER_CLOSURE_INFO, ChecklistItem } from './constants';
import { IMAGES } from '@/lib/constants/images';

/** Checklist item props */
interface ChecklistItemProps {
  item: ChecklistItem;
  index: number;
}

/**
 * Individual checklist item with checkmark icon
 */
const ChecklistItemRow = ({ item, index }: ChecklistItemProps): JSX.Element => {
  return (
    <motion.div
      className="flex items-start gap-2.5 md:gap-4 md:bg-white md:p-3 md:shadow-[0_8px_14px_rgba(0,0,0,0.05)]"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Checkmark Icon */}
      <div className="shrink-0 mt-0.5">
        <CheckSquare className="w-5 h-5 text-brand-primary md:h-6 md:w-6" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-gray-900 text-sm font-normal leading-5 md:text-lg md:font-semibold md:leading-7">{item.title}</p>
        <p className="text-gray-500 text-sm font-normal leading-5 mt-0.5 md:mt-1 md:text-base md:leading-6">{item.description}</p>
      </div>
    </motion.div>
  );
};

/**
 * After Closure Section
 * Displays checklist of post-loan closure actions
 */
const AfterClosureSection = (): JSX.Element => {
  return (
    <section className="py-6 px-4 md:px-0 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-6 md:mb-8 md:text-[32px] md:font-semibold md:leading-tight md:text-[#303236]">
          {AFTER_CLOSURE_INFO.title}
        </h2>

        <div className="md:grid md:grid-cols-2 md:items-start md:gap-8">
          {/* Checklist Items */}
          <div className="space-y-4 md:space-y-3">
            {AFTER_CLOSURE_CHECKLIST.map((item, index) => (
              <ChecklistItemRow key={item.id} item={item} index={index} />
            ))}
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:block">
            <Image
              src={IMAGES.DIRECT_CONTACT_EXPERTS.LAKASH}
              alt="Loan closure documents"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AfterClosureSection;
