'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Coins, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURE_COUNT = 3;
const ROTATION_INTERVAL_MS = 2500;

const CarLoanMobileFeatureCarousel = (): React.ReactNode => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % FEATURE_COUNT);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  let icon: React.ReactNode;
  let title: string;
  let description: string;

  if (activeIndex === 1) {
    icon = <Coins className="h-7 w-7 shrink-0 text-blue-700" />;
    title = 'High Loan Amount';
    description = 'Up to ₹50 Lakhs based on eligibility';
  } else if (activeIndex === 2) {
    icon = <CalendarDays className="h-7 w-7 shrink-0 text-blue-700" />;
    title = 'Easy EMIs';
    description = 'Flexible repayment options';
  } else {
    icon = <Zap className="h-7 w-7 shrink-0 fill-blue-700 text-blue-700" />;
    title = 'Fast Approval';
    description = 'Get your loan approved in minutes';
  }

  return (
    <div className="relative box-border flex min-h-20 w-full max-w-full min-w-0 items-center gap-4 overflow-hidden rounded-md border border-white bg-white/30 px-5 pb-7 pt-3 shadow-sm backdrop-blur-sm md:hidden">
      <div
        key={activeIndex}
        className="flex min-w-0 flex-1 animate-in items-center gap-4 fade-in slide-in-from-right-2 duration-500"
        aria-live="polite"
      >
        {icon}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-700">{description}</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">
        <span className={cn('h-2 w-2 rounded-full bg-blue-200 transition-colors', activeIndex === 0 && 'bg-blue-700')} />
        <span className={cn('h-2 w-2 rounded-full bg-blue-200 transition-colors', activeIndex === 1 && 'bg-blue-700')} />
        <span className={cn('h-2 w-2 rounded-full bg-blue-200 transition-colors', activeIndex === 2 && 'bg-blue-700')} />
      </div>
    </div>
  );
};

export default CarLoanMobileFeatureCarousel;
