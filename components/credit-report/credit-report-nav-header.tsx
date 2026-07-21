'use client';

import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface CreditReportNavHeaderProps {
  readonly title?: string;
  readonly onBack?: () => void;
}

/**
 * Back + title bar used on fetch / process / full-report screens.
 */
export function CreditReportNavHeader({
  title = 'Credit Score',
  onBack,
}: CreditReportNavHeaderProps): ReactNode {

  const handleBack = () => {

    window.history.back();

  };
  return (
    <header className="border-b border-black/[0.06] bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#1F2937] transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
        <h1 className="text-base font-semibold text-[#1F2937]">{title}</h1>
      </div>
    </header>
  );
}
