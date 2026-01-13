'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PercentIcon, CalendarIcon } from '../icons';
import ArrowBadge from '../ui/arrow-badge';
import { useAuth } from '@/hooks/use-auth';

/** Props for TrendingOfferCard component */
interface TrendingOfferCardProps {
  /** Unique identifier (lender ID) */
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
 * 
 * Flow (per PDF Step 5 - User Interaction with Trending Offers):
 * - 5A: If user NOT logged in → Show login modal, continue after success
 * - 5B: If user IS logged in → Proceed directly to check eligibility
 */
const TrendingOfferCard = ({
  id,
  lenderName,
  logoPath,
  badge,
  amount,
  interestRate,
  tenure,
  href,
  index,
}: TrendingOfferCardProps): React.ReactNode => {
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithAction } = useAuth();

  /**
   * Handle CTA button click
   * Per PDF Step 5: Check auth status before proceeding
   */
  const handleCheckEligibility = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();

      // PDF Step 5A: User Not Logged In → Show login first
      if (!isAuthenticated) {
        openAuthModalWithAction({
          type: 'check_eligibility',
          lenderId: id,
          lenderName,
          href,
        });
        return;
      }

      // PDF Step 5B: User Logged In → Proceed directly
      // TODO: Will add Check Status API call here (Step 6)
      router.push(href);
    },
    [isAuthenticated, openAuthModalWithAction, id, lenderName, href, router]
  );

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
      className="w-full h-full"
    >
      {/* Outer white container */}
      <div
        className="relative rounded-3xl h-full overflow-hidden bg-white border border-gray-200"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Gradient content area */}
        <div
          className="relative p-3 pb-4"
          style={{
            background: 'linear-gradient(145deg, #D4E4FC 0%, #EEF4FF 50%, #FAFCFF 100%)',
          }}
        >
          {/* Ribbon Badge - Arrow style positioned at top right corner */}
          {badge && (
            <div className="absolute right-0 top-4">
              <ArrowBadge text={badge} />
            </div>
          )}

          {/* Header: Logo */}
          <div className="flex items-center mb-1">
            {logoPath ? (
              <Image
                src={logoPath}
                alt={lenderName}
                width={100}
                height={10}
                className="object-contain h-5 w-auto"
                priority
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-wc-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {lenderName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  {lenderName}
                </span>
              </div>
            )}
          </div>

          {/* Amount - Italic blue text */}
          <h3 className="font-medium text-sm mb-1">
            Amount upto {amount}
          </h3>

          {/* Rate & Tenure - With proper icons */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <PercentIcon />
              <span className="text-gray-600 text-xs">Int. rate {interestRate}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon />
              <span className="text-gray-600 text-xs">Upto {tenure}</span>
            </div>
          </div>
        </div>

        {/* CTA Button - On white background outside gradient */}
        <div className="p-2 bg-white">
          <button
            type="button"
            onClick={handleCheckEligibility}
            className="block w-full text-center bg-wc-blue-500 hover:bg-wc-blue-600 active:bg-wc-blue-700 text-white text-base font-semibold py-1 rounded-full transition-all duration-200 cursor-pointer"
            style={{
              boxShadow: '0 4px 14px rgba(30, 95, 230, 0.25)',
            }}
          >
            Check Eligibility
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingOfferCard;
