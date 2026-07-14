'use client';

import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditReportCard } from './credit-report-card';

/**
 * Loading skeletons matching the credit-report layout.
 */
export function CreditReportSkeleton(): ReactNode {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[32%_1fr] lg:gap-5">
        <CreditReportCard>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mx-auto mt-6 h-28 w-48 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-4 w-40" />
        </CreditReportCard>
        <CreditReportCard className="bg-[#2F6BFF]/10">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-6 h-10 w-48" />
          <Skeleton className="mt-4 h-4 w-64" />
          <Skeleton className="mt-8 h-12 w-full lg:w-40" />
        </CreditReportCard>
      </div>
      <CreditReportCard>
        <Skeleton className="h-12 w-full" />
      </CreditReportCard>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <CreditReportCard>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-4 h-3 w-full" />
        </CreditReportCard>
        <CreditReportCard>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-4 h-8 w-full" />
          <Skeleton className="mt-2 h-8 w-full" />
          <Skeleton className="mt-2 h-8 w-full" />
        </CreditReportCard>
        <CreditReportCard>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-6 h-12 w-full" />
        </CreditReportCard>
      </div>
    </div>
  );
}
