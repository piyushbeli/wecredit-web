'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TrendingOfferCard from './trending-offer-card';

/** Offer configuration interface */
interface Offer {
  id: string;
  lenderName: string;
  logoPath?: string;
  badge?: string;
  amount: string;
  interestRate: string;
  tenure: string;
  href: string;
}

/** Static offers data - expanded for grid demo */
const offers: Offer[] = [
  {
    id: 'creditsea',
    lenderName: 'CreditSea',
    logoPath: '/assets/images/credit-sea-logo.png',
    badge: 'Fast Disbursal',
    amount: '1 Lakh Rupee',
    interestRate: '1.5%',
    tenure: '48 m',
    href: '/offers/creditsea',
  },
  {
    id: 'kreditbee',
    lenderName: 'KreditBee',
    logoPath: '/assets/images/kredit-bee-logo.png',
    amount: '1 Lakh Rupee',
    interestRate: '1.5%',
    tenure: '48 m',
    href: '/offers/kreditbee',
  },
  {
    id: 'prefr',
    lenderName: 'Prefr',
    logoPath: '/assets/images/prefr-logo.png',
    amount: '1 Lakh Rupee',
    interestRate: '1.5%',
    tenure: '48 m',
    href: '/offers/prefr',
  },
  {
    id: 'creditsea-2',
    lenderName: 'CreditSea',
    logoPath: '/assets/images/credit-sea-logo.png',
    badge: 'Fast Disbursal',
    amount: '1 Lakh Rupee',
    interestRate: '1.5%',
    tenure: '48 m',
    href: '/offers/creditsea',
  },
  {
    id: 'kreditbee-2',
    lenderName: 'KreditBee',
    logoPath: '/assets/images/kredit-bee-logo.png',
    amount: '1 Lakh Rupee',
    interestRate: '1.5%',
    tenure: '48 m',
    href: '/offers/kreditbee',
  },
  {
    id: 'prefr-2',
    lenderName: 'Prefr',
    logoPath: '/assets/images/prefr-logo.png',
    amount: '1 Lakh Rupee',
    interestRate: '1.5%',
    tenure: '48 m',
    href: '/offers/prefr',
  },
];

/**
 * Trending Offers section component
 * Displays a 3-row grid of offer cards with horizontal scrolling
 */
const TrendingOffersSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-8">
      <div className="px-4">
        {/* Section Title */}
        <motion.h2
          className="text-lg font-semibold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Trending Offers
        </motion.h2>
      </div>

      {/* Horizontal Scroll Container with 3-row Grid */}
      <div className="overflow-x-auto scrollbar-hide">
        <div 
          className="grid grid-flow-col grid-rows-3 gap-3 px-4 pb-2"
          style={{ gridAutoColumns: '280px' }}
        >
          {offers.map((offer, index) => (
            <TrendingOfferCard
              key={offer.id}
              id={offer.id}
              lenderName={offer.lenderName}
              logoPath={offer.logoPath}
              badge={offer.badge}
              amount={offer.amount}
              interestRate={offer.interestRate}
              tenure={offer.tenure}
              href={offer.href}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingOffersSection;

