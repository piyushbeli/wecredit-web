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
      <td className="w-32 bg-black/5 p-2 border-r border-white md:w-[330px] md:px-4 md:py-3">
        <span className="text-gray-700 text-sm font-normal leading-5 md:text-lg md:leading-7">{fee.label}</span>
      </td>
      {/* Value Column */}
      <td className="bg-black/5 p-2 md:px-4 md:py-3">
        <span className="text-gray-500 text-sm font-normal leading-5 md:text-lg md:leading-7">{fee.value}</span>
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
    <section className="py-6 px-4 md:px-0 md:py-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
      >
        {/* Section Title */}
        <h2 className="text-base font-medium text-center text-gray-900 mb-2 md:text-[32px] md:font-semibold md:leading-tight md:text-[#303236]">
          {FEES_CHARGES_INFO.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-5 mb-6 md:mx-auto md:mt-8 md:max-w-[1120px] md:text-xl md:leading-8">{FEES_CHARGES_INFO.description}</p>

        {/* Fees Table */}
        <div className="rounded-lg overflow-hidden md:mx-auto md:mt-12 md:max-w-[900px]">
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
