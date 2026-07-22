'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import {
  checkEligibilityStatus,
  clearQueuedEligibilityCheck,
  fetchFreshBureauPdfUrl,
  hasQueuedEligibilityCheck,
  runQueuedEligibilityCheck,
} from '@/lib/api/eligibility-check-service';
import {
  getCreditReportDashboard,
  getFullCreditReport,
  pollCreditScoreStatus,
  pollFullCreditReportStatus,
} from '@/lib/api/credit-report-service';
import {
  STORAGE_CREDIT_SCORE_FETCH_PENDING,
  STORAGE_CREDIT_SCORE_READY,
} from '@/lib/constants/api-keys';
import { CREDIT_SCORE_PATH, VIEW_REPORT_PATH } from '@/lib/constants/credit-report-routes';
import { downloadBureauPdfReport, getStoredBureauResponse } from '@/lib/utils/bureau-pdf';
import {
  adaptBureauReport,
  isUsableBureauReportResponse,
} from '@/lib/utils/credit-report-adapter';
import {
  buildCreditScoreProgressSteps,
  getCreditReportView,
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

function markCreditScoreReady(): void {
  writeSessionFlag(STORAGE_CREDIT_SCORE_READY, true);
  writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, false);
}

function clearCreditScoreSessionFlags(): void {
  writeSessionFlag(STORAGE_CREDIT_SCORE_READY, false);
  writeSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING, false);
}

/**
 * Single state controller for score-fetch → summary → full-report flow.
 */
export function useCreditReportPage(bureauResponse?: unknown): UseCreditReportPageReturn {
  const router = useRouter();
  const pathname = usePathname();
  const isViewReportRoute = pathname.startsWith(VIEW_REPORT_PATH.replace(/\/$/, ''));
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const initialReport = useMemo(() => {
    if (!bureauResponse || !isUsableBureauReportResponse(bureauResponse)) {
      return null;
    }
    return adaptBureauReport(bureauResponse);
  }, [bureauResponse]);
  const scoreAbortRef = useRef<AbortController | null>(null);
  const fullReportAbortRef = useRef<AbortController | null>(null);
  const unlockInFlightRef = useRef(false);
  const isPdfDownloadingRef = useRef(false);
  const [isBootstrapped, setIsBootstrapped] = useState(initialReport !== null);
  const [status, setStatus] = useState<CreditReportStatus>(
    initialReport && isViewReportRoute ? 'full_report_ready' : initialReport ? 'score_ready' : 'idle'
  );
  const [data, setData] = useState<CreditReportDashboard | null>(
    initialReport?.dashboard ?? null
  );
  const [fullReport, setFullReport] = useState<CreditReportData | null>(
    initialReport?.report ?? null
  );
  const [failurePhase, setFailurePhase] = useState<CreditReportFailurePhase | null>(null);
  const [isUnlockPending, setIsUnlockPending] = useState(false);
  const [scoreFetchKey, setScoreFetchKey] = useState(0);
  const [fullReportFetchKey, setFullReportFetchKey] = useState(0);
  const [shouldFetchScore, setShouldFetchScore] = useState(false);
  const [hasPendingEligibilitySubmission, setHasPendingEligibilitySubmission] =
    useState(false);
  const [eligibilitySubmitKey, setEligibilitySubmitKey] = useState(0);

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
      if (isViewReportRoute) {
        const report = await getFullCreditReport();
        setFullReport(report);
        setStatus('full_report_ready');
      } else {
        setStatus('score_ready');
      }
      setFailurePhase(null);
      markCreditScoreReady();
    } catch {
      setFailurePhase('score');
      setStatus('failed');
      toast.error('Could not load credit report');
    }
  }, [isViewReportRoute]);

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

  const startFullReportFetch = useCallback((): void => {
    if (unlockInFlightRef.current) {
      return;
    }
    unlockInFlightRef.current = true;
    setIsUnlockPending(true);
    setFailurePhase(null);
    setFullReport(null);
    setStatus('generating_full_report');
    setFullReportFetchKey((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (bureauResponse) {
      return;
    }
    if (isAuthLoading) {
      return;
    }
    const storedResponse = getStoredBureauResponse();
    const hasStoredReport = isUsableBureauReportResponse(storedResponse);
    const controller = new AbortController();

    const bootstrap = async (): Promise<void> => {
      if (hasQueuedEligibilityCheck()) {
        await Promise.resolve();
        setHasPendingEligibilitySubmission(true);
        setStatus('generating_score');
        setFailurePhase(null);
        setIsBootstrapped(true);
        return;
      }
      let hasReport = hasStoredReport;
      if (!hasReport && isAuthenticated && user?.phoneNumber) {
        const result = await checkEligibilityStatus(user.phoneNumber, controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        hasReport = result.showSuccess && isUsableBureauReportResponse(result.data);
      }

      if (!hasReport) {
        clearCreditScoreSessionFlags();
        toast.message('Generate your credit report first');
        router.replace('/bureau-report/');
        setIsBootstrapped(true);
        return;
      }

      const isFetchPending = readSessionFlag(STORAGE_CREDIT_SCORE_FETCH_PENDING);
      const isScoreReady = readSessionFlag(STORAGE_CREDIT_SCORE_READY);
      if (isViewReportRoute) {
        setShouldFetchScore(false);
        await loadReadyDashboard();
      } else if (isFetchPending || !isScoreReady) {
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
  }, [bureauResponse, isAuthLoading, isAuthenticated, isViewReportRoute, loadReadyDashboard, router, user?.phoneNumber]);

  useEffect(() => {
    if (!hasPendingEligibilitySubmission) {
      return;
    }
    let isActive = true;
    void (async () => {
      const request = runQueuedEligibilityCheck();
      if (!request) {
        setFailurePhase('score');
        setStatus('failed');
        return;
      }
      const result = await request;
      if (!isActive) {
        return;
      }
      if (!result.success) {
        setFailurePhase('score');
        setStatus('failed');
        return;
      }
      clearQueuedEligibilityCheck();
      setHasPendingEligibilitySubmission(false);
      setFailurePhase(null);
      setStatus('verifying_identity');
      setShouldFetchScore(true);
      setScoreFetchKey((previous) => previous + 1);
    })();
    return () => {
      isActive = false;
    };
  }, [eligibilitySubmitKey, hasPendingEligibilitySubmission]);

  useEffect(() => {
    if (!isBootstrapped || !shouldFetchScore) {
      return;
    }
    abortScoreFetch();
    const controller = new AbortController();
    scoreAbortRef.current = controller;
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
        markCreditScoreReady();
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
        router.push(VIEW_REPORT_PATH);
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
  }, [abortFullReportFetch, fullReportFetchKey, router]);

  useEffect(() => {
    return () => {
      abortScoreFetch();
      abortFullReportFetch();
    };
  }, [abortFullReportFetch, abortScoreFetch]);

  const handleRetry = (): void => {
    if (failurePhase === 'full_report') {
      startFullReportFetch();
      return;
    }
    if (hasPendingEligibilitySubmission) {
      setFailurePhase(null);
      setStatus('generating_score');
      setEligibilitySubmitKey((previous) => previous + 1);
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
    clearCreditScoreSessionFlags();
    router.push('/bureau-report/');
  };

  const handleApplyLoan = (): void => {
    // TODO: Navigate using offerId from backend when offer deep-link is available.
    router.push('/personal-loan/');
  };

  const handleUnlockReport = (): void => {
    if (unlockInFlightRef.current || isUnlockPending || status === 'generating_full_report') {
      return;
    }
    // TODO: Replace with paid unlock / payment flow when backend is ready.
    startFullReportFetch();
  };

  const handleDownloadPdf = async (): Promise<void> => {
    if (isPdfDownloadingRef.current) {
      return;
    }
    isPdfDownloadingRef.current = true;
    try {
      let pdfUrl: string | undefined;
      try {
        if (user?.phoneNumber) {
          pdfUrl = await fetchFreshBureauPdfUrl(user.phoneNumber);
        }
      } catch {
        pdfUrl = undefined;
      }

      if (!pdfUrl) {
        toast.message('PDF download unavailable', {
          description: 'Could not get a fresh PDF link. Please try again.',
        });
        return;
      }

      if (!downloadBureauPdfReport(pdfUrl)) {
        toast.error('Could not download the PDF report', {
          description: 'Please try again.',
        });
      }
    } finally {
      isPdfDownloadingRef.current = false;
    }
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
      router.push(CREDIT_SCORE_PATH);
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
