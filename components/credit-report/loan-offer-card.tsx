'use client';

import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import {
  formatInrAmount,
  formatLoanOfferDesktopSubtitle,
  formatLoanOfferMobileSubtitle,
} from '@/lib/utils/credit-report-formatters';
import type { LoanOfferCardProps } from './loan-offer-card.types';

/**
 * Pre-approved personal loan offer card.
 */
export function LoanOfferCard({ offer }: LoanOfferCardProps): ReactNode {
  const { triggerApplyFlow } = useLoanApplicationStore();
  const amountLabel = formatInrAmount(offer.maximumAmount);
  const mobileSubtitle = formatLoanOfferMobileSubtitle(
    offer.minimumInterestRate,
    offer.disbursalTime
  );
  const desktopSubtitle = formatLoanOfferDesktopSubtitle({
    minimumInterestRate: offer.minimumInterestRate,
    disbursalTime: offer.disbursalTime,
    collateralRequired: offer.collateralRequired,
  });
  const showNoImpactNote = !offer.creditScoreImpact;

  const handleApply = (): void => {
    triggerApplyFlow();
  };

  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#2F6BFF] to-[#1E4FD6] p-5 text-white shadow-[0_12px_28px_rgba(30,79,214,0.28)] lg:p-7">
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-10 h-36 w-36 rounded-full bg-white/5"
        aria-hidden
      />
      {offer.isPreApproved ? (
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3DDC84]" aria-hidden />
          PRE-APPROVED FOR YOU
        </span>
      ) : null}
      <p className="mt-4 text-base font-medium text-white/95 lg:hidden">Personal Loan up to</p>
      <p className="mt-5 hidden text-lg font-medium text-white/95 lg:block">
        Your score qualifies you for a Personal Loan up to
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{amountLabel}</p>
      <p className="mt-2 text-sm text-white/85 lg:hidden">{mobileSubtitle}</p>
      <p className="mt-3 hidden text-base text-white/85 lg:block">{desktopSubtitle}</p>
      <div className="mt-5 flex flex-col gap-3 lg:mt-auto lg:flex-row lg:items-center lg:gap-5 lg:pt-6">
        <button
          type="button"
          onClick={handleApply}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white text-base font-semibold text-[#1E4FD6] transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:w-auto lg:px-8"
        >
          {offer.ctaText}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
        {showNoImpactNote ? (
          <p className="hidden text-sm text-white/80 lg:block">No impact on your score</p>
        ) : null}
      </div>
    </section>
  );
}
