'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Coins, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  LoanFeatureAccent,
  LoanFeatureHighlightsProps,
  LoanFeatureIconName,
  LoanFeatureItem,
} from './loan-feature-highlights.types';

const ROTATION_INTERVAL_MS = 2500;

const DEFAULT_LOAN_FEATURES: readonly LoanFeatureItem[] = [
  {
    title: 'Fast Approval',
    description: 'Get your loan approved in minutes',
    icon: 'zap',
  },
  {
    title: 'High Loan Amount',
    description: 'Up to ₹50 Lakhs based on eligibility',
    icon: 'coins',
  },
  {
    title: 'Easy EMIs',
    description: 'Flexible repayment options',
    icon: 'calendar',
  },
];

function renderFeatureIcon(
  icon: LoanFeatureIconName,
  accent: LoanFeatureAccent
): React.ReactNode {
  const isGold = accent === 'gold';
  const iconClassName = isGold ? 'text-amber-700' : 'text-blue-700';
  if (icon === 'coins') {
    return <Coins className={cn('h-7 w-7 shrink-0', iconClassName)} />;
  }
  if (icon === 'calendar') {
    return <CalendarDays className={cn('h-7 w-7 shrink-0', iconClassName)} />;
  }
  return (
    <Zap
      className={cn(
        'h-6 w-6 shrink-0 sm:h-7 sm:w-7',
        isGold ? 'fill-amber-600 text-amber-700' : 'fill-blue-700 text-blue-700'
      )}
    />
  );
}

/**
 * Rotating feature card on mobile and stacked cards on desktop.
 */
const LoanFeatureHighlights = ({
  features = DEFAULT_LOAN_FEATURES,
  accent = 'blue',
}: LoanFeatureHighlightsProps): React.ReactNode => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % features.length);
    }, ROTATION_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [features.length]);
  const activeFeature = features[activeIndex] ?? features[0];
  const isGold = accent === 'gold';
  return (
    <div className="w-full max-w-full min-w-0 space-y-3 text-gray-950">
      <div className="relative box-border flex min-h-20 w-full max-w-full min-w-0 items-center gap-4 overflow-hidden rounded-md border border-white bg-white/30 px-5 pb-7 pt-3 shadow-sm backdrop-blur-sm md:hidden">
        <div
          key={activeIndex}
          className="flex min-w-0 flex-1 animate-in items-center gap-4 fade-in slide-in-from-right-2 duration-500"
          aria-live="polite"
        >
          {renderFeatureIcon(activeFeature.icon, accent)}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{activeFeature.title}</p>
            <p className="text-xs text-gray-700">{activeFeature.description}</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">
          {features.map((feature, index) => (
            <span
              key={feature.title}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                isGold ? 'bg-amber-200' : 'bg-blue-200',
                activeIndex === index && (isGold ? 'bg-amber-700' : 'bg-blue-700')
              )}
            />
          ))}
        </div>
      </div>
      {features.map((feature) => (
        <div
          key={feature.title}
          className="hidden w-full max-w-full min-w-0 items-center gap-4 rounded-md border border-white bg-white/30 px-5 py-4 shadow-sm backdrop-blur-sm md:flex"
        >
          {renderFeatureIcon(feature.icon, accent)}
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-sm font-medium">{feature.title}</p>
            <p className="text-xs text-gray-700">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoanFeatureHighlights;
