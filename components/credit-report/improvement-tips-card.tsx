'use client';

import type { ReactNode } from 'react';
import type { ImprovementTipItem } from '@/types/credit-report';
import { CreditReportCard } from './credit-report-card';

interface ImprovementTipsCardProps {
  readonly tips: readonly ImprovementTipItem[];
  readonly ctaLabel: string;
  readonly onGetFullReport: () => void;
}

/**
 * Tips to improve score with secondary unlock CTA.
 */
export function ImprovementTipsCard({
  tips,
  ctaLabel,
  onGetFullReport,
}: ImprovementTipsCardProps): ReactNode {
  return (
    <CreditReportCard className="flex h-full flex-col">
      <h2 className="text-base font-bold text-[#1F2937]">Tips to improve</h2>
      {tips.length > 0 ? (
        <ul className="mt-3 space-y-2.5 text-sm leading-6 text-gray-500">
          {tips.map((tip) => (
            <li key={tip.id} className="flex gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                aria-hidden
              />
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={onGetFullReport}
        className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#F8EDEF] text-sm font-semibold text-[#8B1E2D] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E2D] lg:mt-auto"
      >
        {ctaLabel}
      </button>
    </CreditReportCard>
  );
}
