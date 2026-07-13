'use client';

/**
 * MoneyView Hero Section
 * Green background with headline and benefits carousel
 */

import { cn } from '@/lib/utils';
import { normalizeHexColor } from '@/lib/utils/colors';
import MoneyViewCarousel from './moneyview-carousel';

interface MoneyViewHeroProps {
  className?: string;
  backgroundColor?: string | null;
  accentColor?: string | null;
}

const FALLBACK_LENDER_BRAND_COLOUR = '#005AAA';

const MoneyViewHero = ({ className, backgroundColor, accentColor }: MoneyViewHeroProps) => {
  const resolvedBackgroundColor = normalizeHexColor(backgroundColor) || FALLBACK_LENDER_BRAND_COLOUR;
  const resolvedAccentColor = normalizeHexColor(accentColor) || resolvedBackgroundColor;

  return (
    <section
      className={cn(
        'px-4 pt-6 pb-8',
        className
      )}
      style={{ backgroundColor: resolvedBackgroundColor }}
    >
      {/* Headline */}
      <h1 className="text-white text-[28px] sm:text-center leading-tight font-semibold tracking-tight mb-6 font-manrope">
        Get Instant Personal Loan
        <br />
        Upto 10 Lakhs.
      </h1>

      {/* Benefits carousel */}
      <MoneyViewCarousel accentColor={resolvedAccentColor} />
    </section>
  );
};

export default MoneyViewHero;
