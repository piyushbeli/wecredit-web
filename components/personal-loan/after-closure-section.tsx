'use client';

/**
 * After Closure Section Component
 * Checklist of things to do after loan closure
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import { AFTER_CLOSURE_CHECKLIST, AFTER_CLOSURE_INFO, ChecklistItem } from './constants';

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
      className="flex items-start gap-2.5"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Checkmark Icon */}
      <div className="shrink-0 mt-0.5">
        <CheckSquare className="w-5 h-5 text-brand-primary" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-gray-900 text-sm font-normal leading-5">{item.title}</p>
        <p className="text-gray-500 text-sm font-normal leading-5 mt-0.5">{item.description}</p>
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
          {AFTER_CLOSURE_INFO.title}
        </h2>

        {/* Checklist Items */}
        <div className="space-y-4">
          {AFTER_CLOSURE_CHECKLIST.map((item, index) => (
            <ChecklistItemRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AfterClosureSection;
