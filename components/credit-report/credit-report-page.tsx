'use client';

import type { ReactNode } from 'react';
import { useCreditReportPage } from '@/hooks/use-credit-report-page';
import { formatGetFullReportCta } from '@/lib/utils/credit-report-formatters';
import { CreditReportHeader } from './credit-report-header';
import { CreditReportPageIntro } from './credit-report-page-intro';
import { CreditReportSkeleton } from './credit-report-skeleton';
import { CreditScoreCard } from './credit-score-card';
import { CreditSummaryCard } from './credit-summary-card';
import { FullCreditReportCard } from './full-credit-report-card';
import { ImprovementTipsCard } from './improvement-tips-card';
import { LoanOfferCard } from './loan-offer-card';
import { ScoreFactorsCard } from './score-factors-card';

/**
 * Credit-report page: loads service data and composes presentational cards.
 */
export function CreditReportPage(): ReactNode {
  const {
    status,
    data,
    handleRetry,
    handleRefresh,
    handleStartOver,
    handleApplyLoan,
    handleUnlockReport,
    handleTalkToUs,
  } = useCreditReportPage();

  let body: ReactNode;
  if (status === 'error') {
    body = (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">Unable to load credit report</h2>
        <p className="mt-2 text-sm text-gray-500">Please try again in a moment.</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-5 inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  } else if (status === 'loading' || !data) {
    body = <CreditReportSkeleton />;
  } else {
    const { visibility, loanOffer, fullCreditReport } = data;
    const canShowLoanOffer = visibility.showLoanOffer && loanOffer.isEligible;
    const canShowFullReport = visibility.showFullReport && fullCreditReport.isAvailable;
    const tipsCtaLabel = formatGetFullReportCta(
      fullCreditReport.sellingPrice,
      fullCreditReport.currency
    );
    body = (
      <>
        <CreditReportPageIntro
          firstName={data.user.firstName}
          showStartOver={visibility.showStartOver}
          onStartOver={handleStartOver}
        />
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,32%)_minmax(0,68%)] lg:gap-5">
            <CreditScoreCard creditScore={data.creditScore} onRefresh={handleRefresh} />
            {canShowLoanOffer ? (
              <LoanOfferCard offer={loanOffer} onApply={handleApplyLoan} />
            ) : null}
          </div>
          {canShowFullReport ? (
            <FullCreditReportCard report={fullCreditReport} onUnlock={handleUnlockReport} />
          ) : null}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
            {visibility.showScoreFactors ? (
              <ScoreFactorsCard factors={data.scoreFactors} />
            ) : null}
            {visibility.showCreditSummary ? (
              <CreditSummaryCard items={data.creditSummary} />
            ) : null}
            {visibility.showImprovementTips ? (
              <ImprovementTipsCard
                tips={data.improvementTips}
                ctaLabel={tipsCtaLabel}
                onGetFullReport={handleUnlockReport}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] lg:px-6 lg:py-8">
      <div className="mx-auto w-full max-w-lg lg:max-w-6xl lg:overflow-hidden lg:rounded-[28px] lg:bg-[#F7F9FC] lg:shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
        <CreditReportHeader onTalkToUs={handleTalkToUs} />
        <main className="px-4 py-4 pb-10 lg:px-8 lg:pb-10 lg:pt-6">{body}</main>
      </div>
    </div>
  );
}
