'use client';

/**
 * Offers layout mounts the shared apply-flow (auth → dedupe → auto-fill → multi-lender form)
 * on all offers routes (/offers and /offers/status). This allows triggerApplyFlow() calls
 * from offer page CTAs to open the lead form without navigating to the home page.
 */

import { PersonalLoanContent } from '@/components/personal-loan/personal-loan-content';

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PersonalLoanContent />
    </>
  );
}
