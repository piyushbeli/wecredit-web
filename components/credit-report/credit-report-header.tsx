'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { cn } from '@/lib/utils';

interface CreditReportHeaderProps {
  readonly onTalkToUs?: () => void;
  readonly className?: string;
  readonly showTalkToUs?: boolean;
}

/**
 * Credit report top bar — logo always; help link on desktop only.
 */
export function CreditReportHeader({
  onTalkToUs,
  className,
  showTalkToUs = true,
}: CreditReportHeaderProps): ReactNode {
  return (
    <header
      className={cn(
        'border-b border-black/[0.04] bg-white px-4 py-3 lg:rounded-t-[28px] lg:px-8 lg:py-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Image
          src={IMAGES.LOGOS.TRANSPARENT}
          alt="WeCredit"
          width={114}
          height={26}
          className="h-6 w-auto object-contain"
          priority
        />
        {showTalkToUs ? (
          <p className="hidden text-sm text-gray-500 lg:block">
            Need help?{' '}
            <button
              type="button"
              onClick={onTalkToUs}
              className="cursor-pointer font-semibold text-brand-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Talk to us
            </button>
          </p>
        ) : null}
      </div>
    </header>
  );
}
