'use client';

/**
 * Interest Rates Table Component
 * Displays lender-wise interest rate comparison in mobile-friendly cards
 */

import { JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LENDER_RATES, LenderRate } from './constants';

/** Lender card props */
interface LenderCardProps {
  lender: LenderRate;
  index: number;
}

/**
 * Individual lender rate card component
 */
const LenderCard = ({ lender, index }: LenderCardProps): JSX.Element => {
  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Lender Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm">
          <Image
            src={lender.logo}
            alt={lender.name}
            width={32}
            height={32}
            className="object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <span className="font-semibold text-gray-900">{lender.name}</span>
      </div>

      {/* Rate Details Grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        <RateItem label="Interest Rate" value={lender.interestRate} />
        <RateItem label="Processing Fee" value={lender.processingFee} />
        <RateItem label="Loan Amount" value={lender.loanAmount} />
        <RateItem label="Tenure" value={lender.tenure} />
      </div>
    </motion.div>
  );
};

/** Rate item props */
interface RateItemProps {
  label: string;
  value: string;
}

/**
 * Individual rate detail item
 */
const RateItem = ({ label, value }: RateItemProps): JSX.Element => {
  return (
    <div className="bg-white p-3">
      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
};

/**
 * Interest Rates Table Section
 * Displays comparison of interest rates across different lenders
 */
const InterestRatesTable = (): JSX.Element => {
  return (
    <section className="bg-gray-50 py-6 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Section Title */}
        <h2 className="text-xl font-semibold text-center mb-2">
          Personal Loan <span className="text-wc-blue-600">Offers & Interest Rates</span>
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Compare interest rates from our partner lenders
        </p>

        {/* Lender Cards Grid */}
        <div className="space-y-4">
          {LENDER_RATES.map((lender, index) => (
            <LenderCard key={lender.id} lender={lender} index={index} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-4">
          *Interest rates and terms may vary based on your credit profile
        </p>
      </motion.div>
    </section>
  );
};

export default InterestRatesTable;
