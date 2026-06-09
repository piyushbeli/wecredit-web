'use client';

/**
 * Sticky bottom CTA for the Instant Personal Loan page.
 * Uses the Figma-exported button background image for pixel-accurate styling.
 */

import { JSX, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useLoanApplicationStore } from '@/stores/loan-application-store';

const StickyCta = (): JSX.Element => {
  const { triggerApplyFlow, isApplyLoading } = useLoanApplicationStore();

  const handleClick = useCallback((): void => {
    if (!triggerApplyFlow) {
      return;
    }
    triggerApplyFlow();
  }, [triggerApplyFlow]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={handleClick}
        disabled={isApplyLoading}
        className="ipl-sticky-cta-button w-full max-w-xl mx-auto h-14 flex items-center justify-center text-base font-medium"
      >
        {isApplyLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading" />
        ) : (
          'Get Instant Loan'
        )}
      </button>
    </div>
  );
};

export default StickyCta;
