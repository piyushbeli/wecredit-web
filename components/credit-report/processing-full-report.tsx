'use client';

import type { ReactNode } from 'react';
import { FULL_REPORT_PROCESSING_COPY } from '@/lib/constants/credit-report-flow';
import { CreditReportLoader } from './credit-report-loader';

interface ProcessingFullReportProps {
  readonly title?: string;
}

/**
 * Screen 3 — full-report processing (mobile full-bleed; desktop centered card).
 */
export function ProcessingFullReport({
  title = FULL_REPORT_PROCESSING_COPY.title,
}: ProcessingFullReportProps): ReactNode {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 lg:min-h-[calc(100vh-5rem)] lg:px-6">
      <div className="flex w-full max-w-md flex-col items-center text-center lg:rounded-2xl lg:border lg:border-black/[0.04] lg:bg-white lg:px-10 lg:py-14 lg:shadow-[0_12px_40px_rgba(16,24,40,0.08)]">
        <CreditReportLoader label="Processing full credit report" />
        <h2 className="mt-8 text-xl font-bold tracking-tight text-[#1F2937] sm:text-2xl">{title}</h2>
      </div>
    </div>
  );
}
