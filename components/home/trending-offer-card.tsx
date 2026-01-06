'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

/** Props for TrendingOfferCard component */
interface TrendingOfferCardProps {
  /** Unique identifier */
  id: string;
  /** Lender name */
  lenderName: string;
  /** Lender logo path */
  logoPath?: string;
  /** Badge text (e.g., "Fast Disbursal") */
  badge?: string;
  /** Maximum loan amount */
  amount: string;
  /** Interest rate */
  interestRate: string;
  /** Loan tenure */
  tenure: string;
  /** CTA link */
  href: string;
  /** Animation delay index */
  index: number;
}

/**
 * Trending offer card component
 * Displays lender info with amount, rate, tenure and CTA
 */
const TrendingOfferCard = ({
  lenderName,
  logoPath,
  badge,
  amount,
  interestRate,
  tenure,
  href,
  index,
}: TrendingOfferCardProps): React.ReactNode => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      className="shrink-0 w-[280px]"
    >
      <div
        className="rounded-2xl p-4 h-full"
        style={{
          background: 'linear-gradient(135deg, #CCDFFC 0%, #FAFCFF 100%)',
        }}
      >
        {/* Header: Logo + Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {logoPath ? (
              <Image
                src={logoPath}
                alt={lenderName}
                width={120}
                height={80}
                className="rounded-md object-contain"
                priority
              />
            ) : (
              <div className="w-6 h-6 rounded-md bg-wc-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {lenderName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          {badge && (
            <span className="text-[10px] font-medium text-white bg-wc-dark px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Amount */}
        <h3 className="text-base font-bold text-gray-900 mb-2">
          Amount upto {amount}
        </h3>

        {/* Rate & Tenure */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-wc-blue-500">%</span>
            <span>Int. rate {interestRate}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-wc-blue-500">⏱</span>
            <span>Upto {tenure}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={href}
          className="block w-full text-center bg-wc-blue-500 hover:bg-wc-blue-600 text-white text-sm font-medium py-2.5 rounded-full transition-colors"
        >
          Check Eligibility
        </Link>
      </div>
    </motion.div>
  );
};

export default TrendingOfferCard;

