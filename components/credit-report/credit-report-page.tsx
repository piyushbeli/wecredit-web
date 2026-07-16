'use client';

import dynamic from 'next/dynamic';
import { useEffect, type ReactNode } from 'react';
import { useCreditReportPage } from '@/hooks/use-credit-report-page';
import { CREDIT_REPORT_ERROR_COPY } from '@/lib/constants/credit-report-flow';
import { formatGetFullReportCta } from '@/lib/utils/credit-report-formatters';
import { CreditReportHeader } from './credit-report-header';
import { CreditReportNavHeader } from './credit-report-nav-header';
import { CreditReportPageIntro } from './credit-report-page-intro';
import { CreditReportSkeleton } from './credit-report-skeleton';
import { CreditScoreCard } from './credit-score-card';
import { CreditSummaryCard } from './credit-summary-card';
import { FetchingCreditScore } from './fetching-credit-score';
import { FullCreditReportCard } from './full-credit-report-card';
import { ImprovementTipsCard } from './improvement-tips-card';
import { LoanOfferCard } from './loan-offer-card';
import { ProcessingFullReport } from './processing-full-report';
import { ReportErrorState } from './report-error-state';
import { ScoreFactorsCard } from './score-factors-card';

const FullCreditReport = dynamic(
  () => import('./full-credit-report').then((module) => module.FullCreditReport),
  {
    ssr: false,
    loading: () => <CreditReportSkeleton />,
  }
);

/**
 * Credit-report flow: fetching → summary → processing → full report.
 */
export function CreditReportPage(): ReactNode {
  const {
    isBootstrapped,
    view,
    data,
    fullReport,
    progressSteps,
    failurePhase,
    isUnlockPending,
    handleRetry,
    handleRefresh,
    handleStartOver,
    handleApplyLoan,
    handleUnlockReport,
    handleDownloadPdf,
    handleTalkToUs,
    handleBack,
  } = useCreditReportPage();

  // Prefetch screen 4 while summary/processing is visible so unlock does not flash skeleton.
  useEffect(() => {
    if (view === 'summary' || view === 'processing') {
      void import('./full-credit-report');
    }
  }, [view]);

  const isCreditScoreUnavailable = data?.creditScore.score === -1;
  const isFlowView = view === 'fetching' || view === 'processing' || view === 'full_report'
    || isCreditScoreUnavailable || (view === 'error' && failurePhase !== null);
  const isCenteredFlowCard = view === 'fetching' || view === 'processing'
    || isCreditScoreUnavailable || (view === 'error' && failurePhase !== null);

  let body: ReactNode;
  if (!isBootstrapped) {
    body = <CreditReportSkeleton />;
  } else if (view === 'fetching') {
    body = <FetchingCreditScore steps={progressSteps} />;
  } else if (isCreditScoreUnavailable) {
    body = (
      <div className="flex min-h-[70vh] items-center justify-center lg:min-h-[calc(100vh-5rem)]">
        <div className="w-full max-w-md lg:rounded-2xl lg:border lg:border-black/[0.04] lg:bg-white lg:px-6 lg:py-4 lg:shadow-[0_12px_40px_rgba(16,24,40,0.08)]">
          <ReportErrorState
            title={CREDIT_REPORT_ERROR_COPY.unavailableTitle}
            description={CREDIT_REPORT_ERROR_COPY.unavailableDescription}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  } else if (view === 'processing') {
    body = <ProcessingFullReport />;
  } else if (view === 'full_report' && fullReport) {
    body = <FullCreditReport report={fullReport} onDownloadPdf={handleDownloadPdf} />;
  } else if (view === 'error') {
    let errorTitle: string = CREDIT_REPORT_ERROR_COPY.scoreTitle;
    let errorDescription: string = CREDIT_REPORT_ERROR_COPY.scoreDescription;
    if (failurePhase === 'full_report') {
      errorTitle = CREDIT_REPORT_ERROR_COPY.fullReportTitle;
      errorDescription = CREDIT_REPORT_ERROR_COPY.fullReportDescription;
    }
    body = (
      <div className="flex min-h-[70vh] items-center justify-center lg:min-h-[calc(100vh-5rem)]">
        <div className="w-full max-w-md lg:rounded-2xl lg:border lg:border-black/[0.04] lg:bg-white lg:px-6 lg:py-4 lg:shadow-[0_12px_40px_rgba(16,24,40,0.08)]">
          <ReportErrorState
            title={errorTitle}
            description={errorDescription}
            onRetry={handleRetry}
            isRetryDisabled={isUnlockPending}
          />
        </div>
      </div>
    );
  } else if (view === 'summary' && data) {
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
            <FullCreditReportCard
              report={fullCreditReport}
              onUnlock={handleUnlockReport}
            />
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
  } else {
    body = <CreditReportSkeleton />;
  }

  let shellClassName = 'min-h-screen bg-[#F4F6F9] lg:px-6 lg:py-8';
  let panelClassName =
    'mx-auto w-full max-w-lg lg:max-w-6xl lg:overflow-hidden lg:rounded-[28px] lg:bg-[#F7F9FC] lg:shadow-[0_20px_60px_rgba(16,24,40,0.08)]';
  let mainClassName = 'px-4 py-4 pb-10 lg:px-8 lg:pb-10 lg:pt-6';

  if (isBootstrapped && isFlowView) {
    if (isCenteredFlowCard) {
      shellClassName = 'min-h-screen bg-white lg:bg-[#F4F6F9]';
      panelClassName = 'mx-auto flex min-h-screen w-full max-w-lg flex-col lg:max-w-none';
      mainClassName = 'flex flex-1 flex-col px-0 lg:px-6';
    } else {
      // Full report — wide desktop canvas with logo header
      shellClassName = 'min-h-screen bg-white lg:bg-[#F4F6F9] lg:px-6 lg:py-8';
      panelClassName =
        'mx-auto w-full max-w-lg lg:max-w-6xl lg:overflow-hidden lg:rounded-[28px] lg:bg-white lg:shadow-[0_20px_60px_rgba(16,24,40,0.08)]';
      mainClassName = 'px-4 py-4 pb-10 lg:px-8 lg:pb-10 lg:pt-6';
    }
  }

  let header: ReactNode;
  if (isBootstrapped && isFlowView) {
    const canGoBack = view !== 'processing';
    header = (
      <>
        <div className="lg:hidden">
          <CreditReportNavHeader onBack={canGoBack ? handleBack : undefined} />
        </div>
        <div className="hidden lg:block">
          <CreditReportHeader
            onTalkToUs={handleTalkToUs}
            showTalkToUs={!isCenteredFlowCard}
            className={isCenteredFlowCard ? 'lg:rounded-none' : undefined}
          />
        </div>
      </>
    );
  } else {
    header = <CreditReportHeader onTalkToUs={handleTalkToUs} />;
  }

  return (
    <div className={shellClassName}>
      <div className={panelClassName}>
        {header}
        <main className={mainClassName}>{body}</main>
      </div>
    </div>
  );
}
