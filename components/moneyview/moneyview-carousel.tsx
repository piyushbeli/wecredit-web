'use client';

/**
 * MoneyView Carousel Component
 * Auto-rotating carousel showing loan benefits (Low Interest, Higher Limits, Quick Approval)
 */

import { Shield, Coins, Zap } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselSlide,
  CarouselDots,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface BenefitCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const BENEFIT_CARDS: BenefitCard[] = [
  {
    id: 'low-interest',
    icon: <Shield className="w-6 h-6 text-mv-green" />,
    title: 'Low Interest Rate',
    subtitle: 'Starts 12% p.a.',
  },
  {
    id: 'higher-limits',
    icon: <Coins className="w-6 h-6 text-mv-green" />,
    title: 'Higher Limits',
    subtitle: 'Get higher approved amounts.',
  },
  {
    id: 'quick-approval',
    icon: <Zap className="w-6 h-6 text-mv-green" />,
    title: 'Quick Approval',
    subtitle: 'Apply today, get money fast',
  },
];

interface MoneyViewCarouselProps {
  className?: string;
}

const MoneyViewCarousel = ({ className }: MoneyViewCarouselProps) => {
  return (
    <Carousel
      options={{ loop: true, align: 'center' }}
      plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
      className={cn('w-full max-w-[297px] mx-auto', className)}
    >
      <CarouselContent className="-ml-2">
        {BENEFIT_CARDS.map((card, index) => (
          <CarouselSlide
            key={card.id}
            index={index}
            className="pl-2 basis-full"
          >
            <div className="border border-white/30 rounded-md p-4 min-h-[92px] flex items-center gap-4">
              {/* Icon container */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                {card.icon}
              </div>

              {/* Text content */}
              <div className="flex flex-col">
                <span className="text-white font-medium text-sm leading-tight">
                  {card.title}
                </span>
                <span className="text-white/80 text-xs leading-tight mt-1">
                  {card.subtitle}
                </span>
              </div>
            </div>
          </CarouselSlide>
        ))}
      </CarouselContent>

      {/* Pagination dots */}
      <CarouselDots
        className="mt-3 gap-1.5"
        dotClassName="w-2 h-2 rounded-full bg-white/40 transition-colors"
        activeDotClassName="!bg-white"
      />
    </Carousel>
  );
};

export default MoneyViewCarousel;
