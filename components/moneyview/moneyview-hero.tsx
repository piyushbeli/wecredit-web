'use client';

/**
 * MoneyView Hero Section
 * Green background with headline and benefits carousel
 */

import { cn } from '@/lib/utils';
import MoneyViewCarousel from './moneyview-carousel';

interface MoneyViewHeroProps {
  className?: string;
}

const MoneyViewHero = ({ className }: MoneyViewHeroProps) => {
  return (
    <section
      className={cn(
        'bg-mv-green px-4 pt-6 pb-8',
        className
      )}
    >
      {/* Headline */}
      <h1 className="text-white text-[28px] sm:text-center leading-tight font-semibold tracking-tight mb-6 font-manrope">
        Get Instant Personal Loan
        <br />
        Upto 10 Lakhs.
      </h1>

      {/* Benefits carousel */}
      <MoneyViewCarousel />
    </section>
  );
};

export default MoneyViewHero;
