'use client';

import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

interface CreditReportPageIntroProps {
  readonly firstName: string;
  readonly showStartOver: boolean;
  readonly onStartOver?: () => void;
}

/**
 * Desktop-only page title, greeting, and Start over.
 */
export function CreditReportPageIntro({
  firstName,
  showStartOver,
  onStartOver,
}: CreditReportPageIntroProps): ReactNode {
  return (
    <div className="mb-6 hidden items-start justify-between gap-4 lg:flex">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Your Credit Report</h1>
        <p className="mt-1 text-base text-gray-500">
          Hi {firstName}, here&apos;s your latest score.
        </p>
      </div>
      {showStartOver ? (
        <button
          type="button"
          onClick={onStartOver}
          aria-label="Start over"
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#374151] shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Start over
        </button>
      ) : null}
    </div>
  );
}
