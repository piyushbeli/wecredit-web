'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TrendingOfferCard from './trending-offer-card';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';

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

/** Static offers data */
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

/** Group offers into columns of 3 for vertical stacking */
const groupOffersIntoColumns = (items: Offer[], rowsPerColumn: number): Offer[][] => {
  const columns: Offer[][] = [];
  for (let i = 0; i < items.length; i += rowsPerColumn) {
    columns.push(items.slice(i, i + rowsPerColumn));
  }
  return columns;
};

/**
 * Trending Offers section component
 * Displays a responsive carousel with 3-row columns
 * Mobile: 2 columns visible, Tablet: 3 columns, Desktop: 4 columns
 */
const TrendingOffersSection = (): React.ReactNode => {
  const offerColumns = groupOffersIntoColumns(offers, 3);

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

      <Carousel options={{ loop: true, align: 'start', slidesToScroll: 1 }} className="px-4">
        <CarouselContent className="-ml-3">
          {offerColumns.map((column, colIndex) => (
            <CarouselSlide
              key={colIndex}
              index={colIndex}
              className="basis-4/5 pl-3 md:basis-1/3 lg:basis-1/4"
            >
              {/* 3-row vertical stack */}
              <div className="flex flex-col gap-3">
                {column.map((offer, rowIndex) => (
                  <TrendingOfferCard
                    key={offer.id}
                    id={offer.id}
                    lenderName={offer.lenderName}
                    logoPath={offer.logoPath}
                    badge={'Fast Disbursal'}
                    amount={offer.amount}
                    interestRate={offer.interestRate}
                    tenure={offer.tenure}
                    href={offer.href}
                    index={colIndex * 3 + rowIndex}
                  />
                ))}
              </div>
            </CarouselSlide>
          ))}
        </CarouselContent>

        {/* Dot Indicators */}
        <CarouselDots
          className="mt-4"
          dotClassName="w-2 h-2 rounded-full transition-colors bg-gray-300"
          activeDotClassName="bg-wc-blue-500"
        />
      </Carousel>
    </section>
  );
};

export default TrendingOffersSection;
