'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { PollingLoaderProps } from '@/components/offers/polling-loader.types';

export const PollingLoader = ({
  className,
  showSearchIcon = false,
}: PollingLoaderProps): ReactNode => {
  return (
    <div className={cn('relative mx-auto h-24 w-24', className)}>
      <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-100" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
        {showSearchIcon && <span className="animate-bounce text-5xl">🔍</span>}
        {!showSearchIcon && (
          <div className="h-10 w-10 animate-ping rounded-full border-4 border-blue-400" />
        )}
      </div>
    </div>
  );
};
