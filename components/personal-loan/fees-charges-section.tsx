'use client';

/**
 * Fees and Charges Section Component
 * Displays a table of personal loan fees and charges
 */

import { JSX } from 'react';
import { motion } from 'framer-motion';
import { FEES_AND_CHARGES, FEES_CHARGES_INFO, FeeChargeItem } from './constants';

/** Fee row props */
interface FeeRowProps {
  fee: FeeChargeItem;
  index: number;
}

/**
 * Individual fee row with label and value columns
 */
const FeeRow = ({ fee, index }: FeeRowProps): JSX.Element => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-white"
    >
      {/* Label Column */}
      <td className="w-32 bg-black/5 p-2 border-r border-white">
        <span className="text-gray-700 text-sm font-normal leading-5">{fee.label}</span>
      </td>
      {/* Value Column */}
      <td className="bg-black/5 p-2">
        <span className="text-gray-500 text-sm font-normal leading-5">{fee.value}</span>
      </td>
    </motion.tr>
  );
};

/**
 * Fees and Charges Section
 * Displays personal loan fees in a two-column table format
 */
const FeesAndChargesSection = (): JSX.Element => {
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
        <h2 className="text-base font-medium text-center text-gray-900 mb-2">
          {FEES_CHARGES_INFO.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-5 mb-6">{FEES_CHARGES_INFO.description}</p>

        {/* Fees Table */}
        <div className="rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {FEES_AND_CHARGES.map((fee, index) => (
                <FeeRow key={fee.id} fee={fee} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default FeesAndChargesSection;
