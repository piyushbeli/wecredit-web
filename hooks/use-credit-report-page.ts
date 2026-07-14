'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCreditReportDashboard } from '@/lib/api/credit-report-service';
import { openStoredBureauPdfReport } from '@/lib/utils/bureau-pdf';
import type { CreditReportDashboard, CreditReportPageStatus } from '@/types/credit-report';

interface UseCreditReportPageReturn {
  readonly status: CreditReportPageStatus;
  readonly data: CreditReportDashboard | null;
  readonly handleRetry: () => void;
  readonly handleRefresh: () => void;
  readonly handleStartOver: () => void;
  readonly handleApplyLoan: () => void;
  readonly handleUnlockReport: () => void;
  readonly handleTalkToUs: () => void;
}

/**
 * Loads credit-report dashboard data and exposes interaction handlers.
 */
export function useCreditReportPage(): UseCreditReportPageReturn {
  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState<CreditReportPageStatus>('loading');
  const [data, setData] = useState<CreditReportDashboard | null>(null);

  useEffect(() => {
    let isCancelled = false;
    void (async () => {
      try {
        const dashboard = await getCreditReportDashboard();
        if (isCancelled) {
          return;
        }
        setData(dashboard);
        setStatus('ready');
      } catch {
        if (isCancelled) {
          return;
        }
        setStatus('error');
        toast.error('Could not load credit report');
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  const reloadDashboard = (toastMessage?: string): void => {
    setData(null);
    setStatus('loading');
    setReloadKey((previous) => previous + 1);
    if (toastMessage) {
      toast.message(toastMessage);
    }
  };

  const handleRetry = (): void => {
    reloadDashboard();
  };

  const handleRefresh = (): void => {
    // TODO: Wire to backend refresh credit-score endpoint when available.
    reloadDashboard('Refreshing credit score…');
  };

  const handleStartOver = (): void => {
    // TODO: Confirm product flow (clear session vs re-run bureau form).
    router.push('/bureau-report/');
  };

  const handleApplyLoan = (): void => {
    // TODO: Navigate using offerId from backend when offer deep-link is available.
    router.push('/personal-loan/');
  };

  const handleUnlockReport = (): void => {
    // TODO: Replace with paid unlock / payment flow when backend is ready.
    const didOpen = openStoredBureauPdfReport();
    if (didOpen) {
      return;
    }
    toast.message('Unlock report', {
      description: 'PDF unlock will open here once backend returns pdfUrl.',
    });
  };

  const handleTalkToUs = (): void => {
    router.push('/contact-us/');
  };

  return {
    status,
    data,
    handleRetry,
    handleRefresh,
    handleStartOver,
    handleApplyLoan,
    handleUnlockReport,
    handleTalkToUs,
  };
}
