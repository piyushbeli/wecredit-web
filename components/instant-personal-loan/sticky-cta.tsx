'use client';

/**
 * Sticky bottom CTA for the Instant Personal Loan page.
 * Concentric pill ripple animation centered behind the label.
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
        <span className="ipl-sticky-cta-wave ipl-sticky-cta-wave-1" aria-hidden="true" />
        <span className="ipl-sticky-cta-wave ipl-sticky-cta-wave-2" aria-hidden="true" />
        <span className="ipl-sticky-cta-wave ipl-sticky-cta-wave-3" aria-hidden="true" />
        <span className="relative z-10 flex items-center justify-center">
          {isApplyLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-label="Loading" />
          ) : (
            'Get Instant Loan'
          )}
        </span>
      </button>
    </div>
  );
};

export default StickyCta;
