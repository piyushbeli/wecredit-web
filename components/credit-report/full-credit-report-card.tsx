'use client';

import { ArrowRight, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FullCreditReportInfo } from '@/types/credit-report';
import {
  formatInrPriceLabel,
  formatUnlockReportCta,
} from '@/lib/utils/credit-report-formatters';
import { CreditReportCard } from './credit-report-card';

interface FullCreditReportCardProps {
  readonly report: FullCreditReportInfo;
  readonly onUnlock: () => void;
}

/**
 * Full Equifax report unlock banner (responsive).
 */
export function FullCreditReportCard({
  report,
  onUnlock,
}: FullCreditReportCardProps): ReactNode {
  const originalPrice = formatInrPriceLabel(report.originalPrice);
  const sellingPrice = formatInrPriceLabel(report.sellingPrice);
  const mobileCta = formatUnlockReportCta(report.sellingPrice, report.currency);

  return (
    <CreditReportCard className="lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 lg:items-center lg:gap-4">
          <div
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[#8B1E2D] text-[9px] font-bold leading-tight text-white lg:h-14 lg:w-14"
            aria-hidden
          >
            <FileText className="mb-0.5 h-4 w-4 lg:h-5 lg:w-5" />
            {report.bureau}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-[#1F2937] lg:hidden">
                    {report.mobileTitle}
                  </h2>
                  <h2 className="hidden text-lg font-bold text-[#1F2937] lg:block">
                    {report.desktopTitle}
                  </h2>
                  <span className="hidden rounded-md bg-[#F8EDEF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8B1E2D] lg:inline-flex">
                    {report.bureau} OFFICIAL
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-5 text-gray-500 lg:hidden">
                  {report.mobileDescription}
                </p>
                <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-gray-500 lg:block">
                  {report.description}
                </p>
              </div>
              {/* <div className="flex shrink-0 flex-col items-end lg:hidden">
                <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
                <span className="text-lg font-bold text-[#1F2937]">{sellingPrice}</span>
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          {/* <p className="hidden items-baseline gap-2 lg:flex">
            <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
            <span className="text-2xl font-bold text-[#1F2937]">{sellingPrice}</span>
          </p> */}
          <button
            type="button"
            onClick={onUnlock}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8B1E2D] text-sm font-semibold text-white transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E2D] lg:w-auto lg:min-w-[160px] lg:px-6"
          >
            <span className="lg:hidden">{mobileCta}</span>
            <span className="hidden lg:inline">{report.ctaText}</span>
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </CreditReportCard>
  );
}
