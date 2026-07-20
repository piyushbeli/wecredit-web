import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CreditReportCardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Shared white card shell for credit-report sections.
 */
export function CreditReportCard({ children, className }: CreditReportCardProps): ReactNode {
  return (
    <section
      className={cn(
        'rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:p-5',
        className
      )}
    >
      {children}
    </section>
  );
}
