'use client';

import type { ReactNode } from 'react';
import { CREDIT_REPORT_ERROR_COPY } from '@/lib/constants/credit-report-flow';

interface ReportErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly retryLabel?: string;
  readonly onRetry: () => void;
  readonly isRetryDisabled?: boolean;
}

/**
 * Failure / retry state for score fetch or full-report generation.
 */
export function ReportErrorState({
  title = CREDIT_REPORT_ERROR_COPY.fullReportTitle,
  description = CREDIT_REPORT_ERROR_COPY.fullReportDescription,
  retryLabel = CREDIT_REPORT_ERROR_COPY.retryLabel,
  onRetry,
  isRetryDisabled = false,
}: ReportErrorStateProps): ReactNode {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7ED] text-2xl font-bold text-brand-primary"
        aria-hidden
      >
        !
      </div>
      <h2 className="text-xl font-bold text-[#1F2937]">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">{description}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetryDisabled}
        className="mt-6 inline-flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E2D]"
      >
        {retryLabel}
      </button>
    </div>
  );
}
