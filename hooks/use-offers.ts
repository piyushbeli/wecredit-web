import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCookie } from 'cookies-next';
import { useSearchParams, usePathname } from 'next/navigation';
import { checkStatusAll, hitAllLenders } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import type { CheckStatusAllResponse } from '@/types/wecredit';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import {
  MOCK_REHIT_RESPONSE,
  MOCK_ALL_STATUSES_RESPONSE,
  simulateMockApiCall
} from '@/lib/mock-data/offers';
import { useOfferStore, selectFilteredOffers, selectStatusCounts, type StatusFilter } from '@/stores/offer-store';
import { categorizeOffers } from '@/lib/utils/offer-categorization';
import { UseOffersReturn } from '@/types/offer';
import { deploymentFeatures } from '@/lib/env-features';

export const newPLEnabled = deploymentFeatures.enableNewPL;
/** Polling constants */
const POLL_INTERVAL = 15000; // 15 seconds
const MAX_POLL_DURATION = 90000; // 90 seconds
const API_TIMEOUT = 15000; // 15 seconds

/**
 * Hook for managing loan offers
 * 
 * Features:
 * - Fetches offers on mount using check-status-all API
 * - Smart polling if user just created a lead (newLead=true query param)
 * - Re-hit functionality to check more lenders
 * - Filter offers by status
 * - Status counts for UI badges
 * - Retry mechanism on error
 * - Feature flag support: Use mock data when 'enableOfferMockData' is enabled
 * - Uses centralized Zustand store for state management
 * 
 * @returns Offers data and management functions
 */
// imports remain EXACTLY the same

// (ALL IMPORTS REMAIN EXACTLY THE SAME)

export function useOffers(): UseOffersReturn {
  const {
    offers,
    isLoading,
    isPolling,
    error,
    canReHit,
    isReHitting,
    statusCode,
    selectedStatus,
    setOffers,
    setIsLoading,
    setIsPolling,
    setError,
    setCanReHit,
    setIsReHitting,
    setStatusCode,
    setOfferTrackingMeta,
    setSelectedStatus,
  } = useOfferStore();

  const [shouldTriggerApply, setShouldTriggerApply] = useState(false);
  const [pollTick, setPollTick] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  const searchParams = useSearchParams();

  const isNewLead = searchParams?.get('newLead') === 'true';
  const lenderNameParam = searchParams?.get('lenderName') ??searchParams?.get('lendername') ?? '';
  const pathname = usePathname();
  const shouldSkipRehit = Boolean(lenderNameParam.trim());
  const enableMockData = useFeatureFlag('enableOfferMockData');

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number | null>(null);
  const didInitRef = useRef(false);

  /* -------------------------------------------------- */
  /* ---------------- API CALLS ----------------------- */
  /* -------------------------------------------------- */

  const executeHitAllLenders = useCallback(async ({ force = false }: { force?: boolean } = {}): Promise<boolean> => {
    if (newPLEnabled && !force) return false;
    if (shouldSkipRehit) return false;
    if (enableMockData) return true;

    const mobile = getCookie(STORAGE_MOBILE) as string;
    const token = getCookie(STORAGE_AUTH_TOKEN) as string;
    if (!mobile) return false;

    try {
      const result = await hitAllLenders(mobile, token);
      return result.success;
    } catch {
      return false;
    }
  }, [shouldSkipRehit, enableMockData]);

  const getOfferTrackingMeta = useCallback(
    (response: CheckStatusAllResponse): { declaredSalary: number | string | null; empType: string | null } => {
      // API payload shape is not always stable, so support both camelCase and snake_case keys.
      const declaredSalary = response.declaredSalary ?? null;
      const empType = response.empType ?? null;
      return { declaredSalary, empType };
    },
    []
  );

  const fetchOffers = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      setError(null);

      if (enableMockData) {
        const mock = await simulateMockApiCall(
          MOCK_ALL_STATUSES_RESPONSE
        );
        setOffers(mock.lenders || []);
        setCanReHit(mock.isRehitLenders === 0);
        setStatusCode(mock.statusCode);
        const mockTrackingMeta = getOfferTrackingMeta(mock);
        setOfferTrackingMeta(mockTrackingMeta.declaredSalary, mockTrackingMeta.empType);
        return;
      }

      const mobile = getCookie(STORAGE_MOBILE) as string;
      const token = getCookie(STORAGE_AUTH_TOKEN) as string;
      if (!mobile) {
        setError('Mobile number not found.');
        setOfferTrackingMeta(null, null);
        return;
      }

      try {
        const result = await checkStatusAll(mobile, token, signal);

        if (result.success && result.data) {
          const res = result.data;
          setOffers(res.lenders || []);
          setCanReHit(res.isRehitLenders === 0);
          setStatusCode(res.statusCode);
          const responseTrackingMeta = getOfferTrackingMeta(res);
          setOfferTrackingMeta(responseTrackingMeta.declaredSalary, responseTrackingMeta.empType);
        } else {
          setError(result.error || 'Failed to load offers');
          setOfferTrackingMeta(null, null);
        }
      } catch (err) {
        setOfferTrackingMeta(null, null);
        if (!(err instanceof Error && err.name === 'AbortError')) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unknown error occurred'
          );
        }
      }
    },
    [enableMockData, getOfferTrackingMeta, setOfferTrackingMeta]
  );

  /* -------------------------------------------------- */
  /* ---------------- POLLING ------------------------- */
  /* -------------------------------------------------- */

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    pollStartTimeRef.current = null;
    setIsPolling(false);
  }, []);

  const executePoll = useCallback(async () => {
    if (pollStartTimeRef.current) {
      const elapsed = Date.now() - pollStartTimeRef.current;
      if (elapsed >= MAX_POLL_DURATION) {
        stopPolling();
        return;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      API_TIMEOUT
    );

    try {
      await fetchOffers(controller.signal);
    } finally {
      clearTimeout(timeoutId);
      setPollTick((p) => p + 1);
    }
  }, [fetchOffers, stopPolling]);

  useEffect(() => {
    if (!isPolling) return;

    pollTimerRef.current = setTimeout(
      executePoll,
      POLL_INTERVAL
    );

    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [isPolling, executePoll, pollTick]);

  /* -------------------------------------------------- */
  /* ---------------- INITIALIZATION ------------------ */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const init = async () => {
      setIsInitializing(true);
      setIsLoading(true);

      const mobile = getCookie(STORAGE_MOBILE) as string | undefined;

      /* 🚨 EARLY EXIT — NO MOBILE */
      if (!mobile) {
        setShouldTriggerApply(true);
        setIsInitializing(false);
        setIsLoading(false);
        return;
      }

      /* ---------------- FETCH OFFERS FIRST ---------------- */

      await fetchOffers();

      const currentState = useOfferStore.getState();

      /* 🚨 EARLY EXIT — NO LEAD (3018) */
      if (currentState.statusCode?.toString() === '3018') {
        setShouldTriggerApply(true);
        setIsInitializing(false);
        setIsLoading(false);
        return;
      }

      /* ---------------- NEW LEAD FLOW ---------------- */
      if (isNewLead) {

        /* ---------------------------------------------- */
        /* SINGLE LENDER + NEW LEAD                      */
        /* ---------------------------------------------- */
        if (shouldSkipRehit) {
          setIsPolling(true);
          pollStartTimeRef.current = Date.now();
          executePoll();
        }
        else if (!shouldSkipRehit && pathname !== '/offers/status/') {
          await executeHitAllLenders();
          // In new PL, skip polling when initial fetch already has lenders (common on refresh).
          if (!(newPLEnabled && currentState.offers.length > 0)) {
            setIsPolling(true);
            pollStartTimeRef.current = Date.now();
            executePoll();
          }
        }
      } else {
        /* ---------------- DIRECT NAVIGATION ---------------- */

        if (!shouldSkipRehit && currentState.canReHit && pathname !== '/offers/status/')  {
          await executeHitAllLenders();
          // In new PL, polling is only for the "no lenders yet" waiting state.
          if (!(newPLEnabled && currentState.offers.length > 0)) {
            setIsPolling(true);
            pollStartTimeRef.current = Date.now();
            executePoll();
          }
        }
      }

      setIsInitializing(false);
      setIsLoading(false);
    };

    init();
  }, [isNewLead, shouldSkipRehit]);

  /* -------------------------------------------------- */
  /* ---------------- STOP CONDITIONS ----------------- */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!isPolling) return;

    const currentStatus = statusCode?.toString();


    if (shouldSkipRehit && isNewLead) {
      if (currentStatus !== '3004') {
        stopPolling();
      }
      return; 
    }


    if (shouldSkipRehit) {
      if (offers.length > 0) stopPolling();
    } else if (newPLEnabled) {
      // New PL must stop as soon as lenders are available, even when re-hit remains enabled.
      if (offers.length > 0) stopPolling();
    } else {
      if (offers.length > 0 && !canReHit) stopPolling();
    }

  }, [
    offers.length,
    canReHit,
    isPolling,
    shouldSkipRehit,
    statusCode,
    isNewLead,
    newPLEnabled,
    stopPolling,
  ]);
  /* -------------------------------------------------- */
  /* ---------------- RETURN -------------------------- */
  /* -------------------------------------------------- */

  const categorizedOffers = useMemo(() => categorizeOffers(offers), [offers]);

  return {
    offers,
    exploreOffers: categorizedOffers.explore,
    statusOffers: categorizedOffers.recentlyClicked,
    unmatchedOffers: categorizedOffers.unmatched,
    isLoading: isLoading || isInitializing,
    isPolling,
    error,
    canReHit,
    isReHitting,
    statusCode,
    fetchOffers,
    reHitLenders: async () => {
      await executeHitAllLenders({ force: true });
    },
    filterByStatus: (status) => selectFilteredOffers(offers, status),
    statusCounts: selectStatusCounts(offers),
    selectedStatus,
    setSelectedStatus,
    shouldTriggerApply,
  };
}