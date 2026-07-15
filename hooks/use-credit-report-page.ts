'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { checkEligibilityStatus } from '@/lib/api/eligibility-check-service';
import {
  getCreditReportDashboard,
  pollCreditScoreStatus,
  pollFullCreditReportStatus,
} from '@/lib/api/credit-report-service';
import {
  STORAGE_CREDIT_SCORE_FETCH_PENDING,
  STORAGE_CREDIT_SCORE_READY,
} from '@/lib/constants/api-keys';
import { getStoredBureauPdfUrl, getStoredBureauResponse } from '@/lib/utils/bureau-pdf';
import { isUsableBureauReportResponse } from '@/lib/utils/credit-report-adapter';
import {
  buildCreditScoreProgressSteps,
  getCreditReportView,
  openCreditReportPdf,
} from '@/lib/utils/credit-report-flow';
import type {
  CreditReportDashboard,
  CreditReportData,
  CreditReportFailurePhase,
  CreditReportProgressStep,
  CreditReportStatus,
  CreditReportView,
} from '@/types/credit-report';

interface UseCreditReportPageReturn {
  readonly isBootstrapped: boolean;
  readonly status: CreditReportStatus;
  readonly view: CreditReportView;
  readonly data: CreditReportDashboard | null;
  readonly fullReport: CreditReportData | null;
  readonly progressSteps: readonly CreditReportProgressStep[];
  readonly failurePhase: CreditReportFailurePhase | null;
  readonly isUnlockPending: boolean;
  readonly isPdfOpening: boolean;
  readonly handleRetry: () => void;
  readonly handleRefresh: () => void;
  readonly handleStartOver: () => void;
  readonly handleApplyLoan: () => void;
  readonly handleUnlockReport: () => void;
  readonly handleDownloadPdf: () => void;
  readonly handleTalkToUs: () => void;
  readonly handleBack: () => void;
}

function readSessionFlag(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return sessionStorage.getItem(key) === '1';
}

function writeSessionFlag(key: string, value: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (value) {
    sessionStorage.setItem(key, '1');
    return;
  }
  sessionStorage.removeItem(key);
}

/**
 * Single state controller for score-fetch → summary → full-report flow.
 */
export function useCreditReportPage(): UseCreditReportPageReturn {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const scoreAbortRef = useRef<AbortController | null>(null);
  const fullReportAbortRef = useRef<AbortController | null>(null);
  const unlockInFlightRef = useRef(false);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [status, setStatus] = useState<CreditReportStatus>('idle');
  const [data, setData] = useState<CreditReportDashboard | null>(null);
  const [fullReport, setFullReport] = useState<CreditReportData | null>(null);
  const [failurePhase, setFailurePhase] = useState<CreditReportFailurePhase | null>(null);
  const [isUnlockPending, setIsUnlockPending] = useState(false);
  const [isPdfOpening, setIsPdfOpening] = useState(false);
  const [scoreFetchKey, setScoreFetchKey] = useState(0);
  const [fullReportFetchKey, setFullReportFetchKey] = useState(0);
  const [shouldFetchScore, setShouldFetchScore] = useState(false);

  const view = getCreditReportView(status);
  const progressSteps = buildCreditScoreProgressSteps(status, failurePhase === 'score');

  const abortScoreFetch = useCallback((): void => {
    scoreAbortRef.current?.abort();
    scoreAbortRef.current = null;
  }, []);

  const abortFullReportFetch = useCallback((): void => {
    fullReportAbortRef.current?.abort();
    fullReportAbortRef.current = null;
  }, []);

  const loadReadyDashboard = useCallback(async (): Promise<void> => {
    try {
      const dashboard = await getCreditReportDashboard();
      setData(dashboard);
      setStatus('score_ready');
      setFailurePhase(null);
      writeSessionFlag(STORAGE_CREDIT_SCORE_READY, true);
      writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, false);
    } catch {
      setFailurePhase('score');
      setStatus('failed');
      toast.error('Could not load credit report');
    }
  }, []);

  const startScoreFetch = useCallback((): void => {
    abortFullReportFetch();
    unlockInFlightRef.current = false;
    setIsUnlockPending(false);
    setFullReport(null);
    setFailurePhase(null);
    setData(null);
    setStatus('verifying_identity');
    setShouldFetchScore(true);
    setScoreFetchKey((previous) => previous + 1);
  }, [abortFullReportFetch]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    const storedResponse = getStoredBureauResponse();
    const hasStoredReport = isUsableBureauReportResponse(storedResponse);
    const controller = new AbortController();

    const bootstrap = async (): Promise<void> => {
      let hasReport = hasStoredReport;
      if (!hasReport && isAuthenticated && user?.phoneNumber) {
        const result = await checkEligibilityStatus(user.phoneNumber, controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        hasReport = result.showSuccess && isUsableBureauReportResponse(result.data);
      }

      if (!hasReport) {
        writeSessionFlag(STORAGE_CREDIT_SCORE_READY, false);
        writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, false);
        toast.message('Generate your credit report first');
        router.replace('/bureau-report/');
        setIsBootstrapped(true);
        return;
      }

      const isFetchPending = readSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING);
      const isScoreReady = readSessionFlag(STORAGE_CREDIT_SCORE_READY);
      if (isFetchPending || !isScoreReady) {
        setStatus('verifying_identity');
        setShouldFetchScore(true);
        setScoreFetchKey((previous) => previous + 1);
      } else {
        setShouldFetchScore(false);
        setStatus('score_ready');
        await loadReadyDashboard();
      }
      setIsBootstrapped(true);
    };

    void bootstrap();
    return () => {
      controller.abort();
    };
  }, [isAuthLoading, isAuthenticated, loadReadyDashboard, router, user?.phoneNumber]);

  useEffect(() => {
    if (!isBootstrapped || !shouldFetchScore) {
      return;
    }
    abortScoreFetch();
    const controller = new AbortController();
    scoreAbortRef.current = controller;
    setFailurePhase(null);
    void (async () => {
      try {
        const dashboard = await pollCreditScoreStatus({
          onStatus: (nextStatus) => {
            if (!controller.signal.aborted) {
              setStatus(nextStatus);
            }
          },
          signal: controller.signal,
        });
        if (controller.signal.aborted) {
          return;
        }
        setData(dashboard);
        setStatus('score_ready');
        writeSessionFlag(STORAGE_CREDIT_SCORE_READY, true);
        writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, false);
        setShouldFetchScore(false);
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setFailurePhase('score');
        setStatus('failed');
        toast.error('Could not fetch credit score');
      }
    })();
    return () => {
      controller.abort();
    };
  }, [abortScoreFetch, isBootstrapped, scoreFetchKey, shouldFetchScore]);

  useEffect(() => {
    if (fullReportFetchKey === 0) {
      return;
    }
    abortFullReportFetch();
    const controller = new AbortController();
    fullReportAbortRef.current = controller;
    setFailurePhase(null);
    setFullReport(null);
    setStatus('generating_full_report');
    void (async () => {
      try {
        const report = await pollFullCreditReportStatus({
          onStatus: (nextStatus) => {
            if (!controller.signal.aborted) {
              setStatus(nextStatus);
            }
          },
          signal: controller.signal,
        });
        if (controller.signal.aborted) {
          return;
        }
        setFullReport(report);
        setStatus('full_report_ready');
        unlockInFlightRef.current = false;
        setIsUnlockPending(false);
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setFailurePhase('full_report');
        setStatus('failed');
        unlockInFlightRef.current = false;
        setIsUnlockPending(false);
        toast.error('Could not generate full credit report');
      }
    })();
    return () => {
      controller.abort();
    };
  }, [abortFullReportFetch, fullReportFetchKey]);

  useEffect(() => {
    return () => {
      abortScoreFetch();
      abortFullReportFetch();
    };
  }, [abortFullReportFetch, abortScoreFetch]);

  const handleRetry = (): void => {
    if (failurePhase === 'full_report') {
      if (unlockInFlightRef.current) {
        return;
      }
      unlockInFlightRef.current = true;
      setIsUnlockPending(true);
      setFullReportFetchKey((previous) => previous + 1);
      return;
    }
    startScoreFetch();
  };

  const handleRefresh = (): void => {
    // TODO: Wire to backend refresh credit-score endpoint when available.
    writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, true);
    toast.message('Refreshing credit score…');
    startScoreFetch();
  };

  const handleStartOver = (): void => {
    abortScoreFetch();
    abortFullReportFetch();
    writeSessionFlag(STORAGE_CREDIT_SCORE_READY, false);
    writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, false);
    router.push('/bureau-report/');
  };

  const handleApplyLoan = (): void => {
    // TODO: Navigate using offerId from backend when offer deep-link is available.
    router.push('/personal-loan/');
  };

  const handleUnlockReport = (): void => {
    if (unlockInFlightRef.current || isUnlockPending) {
      return;
    }
    if (status === 'generating_full_report') {
      return;
    }
    // TODO: Replace with paid unlock / payment flow when backend is ready.
    unlockInFlightRef.current = true;
    setIsUnlockPending(true);
    setFullReportFetchKey((previous) => previous + 1);
  };

  const handleDownloadPdf = (): void => {
    if (isPdfOpening) {
      return;
    }
    // Existing project pattern: open backend-provided PDF URL (no client PDF generation).
    const storedPdfUrl = getStoredBureauPdfUrl()?.trim() ?? '';
    const reportPdfUrl = fullReport?.pdfUrl?.trim() ?? '';
    const isPlaceholderPdf =
      reportPdfUrl.includes('dummy.pdf') || reportPdfUrl.includes('w3.org/WAI');
    let pdfUrl = storedPdfUrl;
    if (!pdfUrl && reportPdfUrl && !isPlaceholderPdf) {
      pdfUrl = reportPdfUrl;
    }
    if (!pdfUrl) {
      toast.message('PDF download unavailable', {
        description:
          'Equifax PDF opens from the bureau pdfUrl. Submit the credit form first, or wait for the full-report API to return pdfUrl.',
      });
      return;
    }
    setIsPdfOpening(true);
    window.requestAnimationFrame(() => {
      const didOpen = openCreditReportPdf(pdfUrl);
      setIsPdfOpening(false);
      if (!didOpen) {
        toast.error('Could not open the PDF report', {
          description: 'The link may have expired or the browser blocked the new tab.',
        });
      }
    });
  };

  const handleTalkToUs = (): void => {
    router.push('/contact-us/');
  };

  const handleBack = (): void => {
    if (view === 'full_report' || (view === 'error' && failurePhase === 'full_report')) {
      abortFullReportFetch();
      unlockInFlightRef.current = false;
      setIsUnlockPending(false);
      setFullReport(null);
      setFailurePhase(null);
      setStatus('score_ready');
      return;
    }
    if (view === 'processing') {
      return;
    }
    abortScoreFetch();
    router.push('/bureau-report/');
  };

  return {
    isBootstrapped,
    status,
    view,
    data,
    fullReport,
    progressSteps,
    failurePhase,
    isUnlockPending,
    isPdfOpening,
    handleRetry,
    handleRefresh,
    handleStartOver,
    handleApplyLoan,
    handleUnlockReport,
    handleDownloadPdf,
    handleTalkToUs,
    handleBack,
  };
}
