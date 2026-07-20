'use client';

import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CreditReportLoaderProps {
  readonly className?: string;
  readonly size?: 'md' | 'lg';
  readonly label?: string;
}

/**
 * Brand-colored circular spinner for credit-report loading screens.
 */
export function CreditReportLoader({
  className,
  size = 'lg',
  label = 'Loading',
}: CreditReportLoaderProps): ReactNode {
  const sizeClassName = size === 'lg' ? 'h-14 w-14' : 'h-8 w-8';
  return (
    <Loader2
      className={cn('animate-spin text-brand-primary', sizeClassName, className)}
      aria-label={label}
      role="status"
    />
  );
}
