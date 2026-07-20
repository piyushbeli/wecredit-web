'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EquifaxFetchBadgeProps {
  readonly label?: string;
  readonly className?: string;
}

/**
 * Desktop Screen 1 badge — EQUIFAX wordmark inside a spinning blue ring.
 */
export function EquifaxFetchBadge({
  label = 'EQUIFAX',
  className,
}: EquifaxFetchBadgeProps): ReactNode {
  return (
    <div
      className={cn('relative mx-auto flex h-24 w-24 items-center justify-center', className)}
      role="status"
      aria-label="Connecting to Equifax"
    >
      <span
        className="absolute inset-0 animate-spin rounded-full border-[3px] border-brand-primary border-t-transparent"
        aria-hidden
      />
      <span className="text-[11px] font-bold tracking-[0.06em] text-brand-primary">{label}</span>
    </div>
  );
}
