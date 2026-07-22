'use client';

import { ArrowLeft, Download } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CreditReportData } from '@/types/credit-report';
import {
  formatReportGeneratedDate,
  formatReportGeneratedDateDesktop,
  formatScoreChangeLabel,
} from '@/lib/utils/credit-report-flow';
import { CreditScoreGauge } from './credit-score-gauge';
import { ConsumerInformation } from './consumer-information';
import { AccountDetailsList } from './account-details-list';
import { PaymentHistoryGrid } from './payment-history-grid';
import { RecentEnquiries } from './recent-enquiries';

interface FullCreditReportProps {
  readonly report: CreditReportData;
  readonly onDownloadPdf: () => void;
  readonly onBack: () => void;
}

/**
 * Screen 4 — dynamic full Equifax credit report (responsive mobile + desktop).
 */
export function FullCreditReport({
  report,
  onDownloadPdf,
  onBack,
}: FullCreditReportProps): ReactNode {
  const generatedDateMobile = formatReportGeneratedDate(report.generatedAt);
  const generatedDateDesktop = formatReportGeneratedDateDesktop(report.generatedAt);
  const changeLabel = formatScoreChangeLabel(report.score.change);
  let changeClassName = 'text-gray-500';
  if (report.score.change > 0) {
    changeClassName = 'text-[#1FAF5A]';
  } else if (report.score.change < 0) {
    changeClassName = 'text-[#E23B3B]';
  }
  const enquiries = report.enquiries ?? [];

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-5 pb-4 lg:gap-6">
      <button
        type="button"
        onClick={onBack}
        className="hidden w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-[#1F2937] hover:text-brand-primary lg:inline-flex"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to credit score
      </button>
      <section className="rounded-2xl bg-[#8B1E2D] p-4 text-white sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-bold tracking-wide lg:text-xl">{report.bureau}</p>
            <p className="mt-0.5 text-xs text-white/80 lg:text-sm">Credit Information Report</p>
          </div>
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <div className="hidden text-right text-xs text-white/80 lg:block lg:text-sm">
              <p>Report ID: {report.reportId}</p>
              <p className="mt-1">Generated: {generatedDateDesktop}</p>
            </div>
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-[#8B1E2D] transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-10 lg:px-4 lg:text-sm"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              <span className="lg:hidden">PDF</span>
              <span className="hidden lg:inline">Download PDF</span>
            </button>
          </div>
        </div>
        <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-white/70 lg:hidden">
          Report ID: {report.reportId} · {generatedDateMobile}
        </p>
      </section>

      <div className="grid min-w-0 max-w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)] lg:gap-6">
        <div className="order-2 min-w-0 max-w-full rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:p-5 lg:order-1 lg:p-6">
          <ConsumerInformation consumer={report.consumer} />
        </div>
        <section className="order-1 min-w-0 max-w-full rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:p-5 lg:order-2 lg:p-5">
          <CreditScoreGauge
            score={report.score.value}
            minimumScore={report.score.min}
            maximumScore={report.score.max}
            rating={report.score.category}
          />
          <div className="mt-2 flex justify-center">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F6F9] px-3 py-1 text-xs text-gray-500">
              <span>{report.score.riskLabel}</span>
              <span aria-hidden>·</span>
              <span className={`font-semibold ${changeClassName}`}>{changeLabel}</span>
            </p>
          </div>
        </section>
      </div>

      <div className="min-w-0 max-w-full rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:p-5 lg:p-6">
        <AccountDetailsList accounts={report.accounts} />
      </div>

      <div className="rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:p-5 lg:p-6">
        <PaymentHistoryGrid paymentHistory={report.paymentHistory} />
      </div>

      {enquiries.length > 0 ? (
        <div className="rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:p-5 lg:p-6">
          <RecentEnquiries enquiries={enquiries} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onDownloadPdf}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#8B1E2D] text-sm font-semibold text-white transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E2D] lg:hidden"
      >
        <Download className="h-4 w-4" aria-hidden />
        Download report PDF
      </button>

      <div className="hidden items-center justify-between gap-6 rounded-2xl bg-[#F8EDEF] px-6 py-5 lg:flex">
        <div>
          <p className="text-base font-bold text-[#1F2937]">Download your report</p>
          <p className="mt-1 text-sm text-gray-500">
            Save the complete {report.bureau} report as a PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#8B1E2D] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E2D]"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download PDF
        </button>
      </div>
    </div>
  );
}
