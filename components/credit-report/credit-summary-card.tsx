'use client';

import type { ReactNode } from 'react';
import type { CreditSummaryItem } from '@/types/credit-report';
import {
  formatSummaryValue,
  getHideOnMobileClassName,
} from '@/lib/utils/credit-report-formatters';
import { CreditReportCard } from './credit-report-card';

interface CreditSummaryCardProps {
  readonly items: readonly CreditSummaryItem[];
}

/**
 * Key credit summary metrics.
 */
export function CreditSummaryCard({ items }: CreditSummaryCardProps): ReactNode {
  if (items.length === 0) {
    return null;
  }

  return (
    <CreditReportCard className="h-full">
      <h2 className="text-base font-bold text-[#1F2937]">Your credit summary</h2>
      <div className="mt-1 divide-y divide-gray-100">
        {items.map((item) => {
          const formatted = formatSummaryValue(item.value, item.valueType, item.currency);
          const valueClassName = item.highlight
            ? 'text-sm font-bold text-[#1FAF5A]'
            : 'text-sm font-bold text-[#1F2937]';
          const visibilityClass = getHideOnMobileClassName(item.hideOnMobile, 'flex');
          const rowClassName = visibilityClass
            ? `${visibilityClass} items-center justify-between gap-3 py-3`
            : 'flex items-center justify-between gap-3 py-3';
          return (
            <div key={item.key} className={rowClassName}>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={valueClassName}>{formatted}</p>
            </div>
          );
        })}
      </div>
    </CreditReportCard>
  );
}
