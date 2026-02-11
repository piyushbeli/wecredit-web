import { useCallback, useEffect, useRef, useState } from 'react';
import { getCookie } from 'cookies-next';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { checkStatusAll, hitAllLenders } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import type { LenderOfferStatus, WcStatus } from '@/types/wecredit';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { 
  MOCK_REHIT_RESPONSE, 
  MOCK_ALL_STATUSES_RESPONSE,
  simulateMockApiCall 
} from '@/lib/mock-data/offers';
import { useOfferStore, selectFilteredOffers, selectStatusCounts, selectExploreOffers, selectStatusOffers, type StatusFilter } from '@/stores/offer-store';
import { UseOffersReturn } from '@/types/offer';

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
export function useOffers(): UseOffersReturn {
  // Get state and actions from the store
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
    setSelectedStatus,
  } = useOfferStore();

  // Local state for poll tick (not shared across components)
  const [pollTick, setPollTick] = useState(0);
  
  const searchParams = useSearchParams();
  const isNewLead = searchParams?.get('newLead') === 'true';
  // Skip re-hit when a specific lender flow is identified via query params.
  const lenderNameParam = searchParams?.get('lenderName') ?? searchParams?.get('lendername') ?? '';
  const shouldSkipRehit = Boolean(lenderNameParam.trim());
  const enableMockData = useFeatureFlag('enableOfferMockData');
  
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number | null>(null);
  const didInitialFetchRef = useRef(false);
  const didPollingExpireRef = useRef(false);

  /**
   * Re-hit all lenders to check for more offers
   * Only proceeds if isRehitLenders === 0 (more lenders available)
   */
  const reHitLenders = useCallback(async (): Promise<void> => {
    // Guard: Only proceed if re-hit is allowed (isRehitLenders === 0)
    if (!canReHit) {
      console.warn('[useOffers] Re-hit not allowed - all lenders already checked');
      toast.info('Already checked all available lenders', {
        description: 'We\'ve already checked with all our partner lenders for you.',
      });
      return;
    }

    setIsReHitting(true);
    setError(null);

    // Feature flag: Use mock data for testing
    if (enableMockData) {
      console.info('[FeatureFlag] Using mock re-hit offers data');
      try {
        const mockResponse = await simulateMockApiCall(MOCK_REHIT_RESPONSE);
        setOffers(mockResponse.lenders || []);
        setCanReHit(mockResponse.isRehitLenders === 0);
        setStatusCode(mockResponse.statusCode);
        toast.success('Found more offers!', {
          description: 'We found additional lenders for you.',
        });
      } catch (err) {
        setError('Failed to load mock data');
      } finally {
        setIsReHitting(false);
      }
      return;
    }

    // Real API call
    const mobile = getCookie(STORAGE_MOBILE) as string;
    const token = getCookie(STORAGE_AUTH_TOKEN) as string;

    if (!mobile) {
      setError('Mobile number not found. Please login again.');
      setIsReHitting(false);
      return;
    }

    try {
      const result = await hitAllLenders(mobile, token);

      if (result.success && result.data) {
        const response = result.data;
        setOffers(response.lenders || []);
        setCanReHit(response.isRehitLenders === 0);
        setStatusCode(response.statusCode);
      } else {
        setError(result.error || 'Failed to check for new offers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsReHitting(false);
    }
  }, [canReHit, enableMockData, setOffers, setIsReHitting, setError, setCanReHit, setStatusCode]);

  /**
   * Fetch offers from API or mock data
   */
  const fetchOffers = useCallback(async (signal?: AbortSignal): Promise<void> => {
    // Only show global loading on first fetch when not polling
    if (!isPolling) {
      setIsLoading(true);
    }
    setError(null);

    // Feature flag: Use mock data for testing
    if (enableMockData) {
      console.info('[FeatureFlag] Using mock offers data');
      try {
        // Use MOCK_ALL_STATUSES_RESPONSE to test all status badges in UI
        // Switch to MOCK_CHECK_STATUS_RESPONSE for normal testing
        const mockResponse = await simulateMockApiCall(MOCK_ALL_STATUSES_RESPONSE);
        setOffers(mockResponse.lenders || []);
        setCanReHit(mockResponse.isRehitLenders === 0);
        setStatusCode(mockResponse.statusCode);
      } catch (err) {
        setError('Failed to load mock data');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Real API call
    const mobile = getCookie(STORAGE_MOBILE) as string;
    const token = getCookie(STORAGE_AUTH_TOKEN) as string;

    console.info(`[useOffers] Fetching offers. Mobile present: ${!!mobile}, Token present: ${!!token}, isPolling: ${isPolling}`);

    if (!mobile) {
      setError('Mobile number not found. Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await checkStatusAll(mobile, token, signal);

      if (result.success && result.data) {
        const response = result.data;
        const newOffers = response.lenders || [];
        setOffers(newOffers);
        setCanReHit(response.isRehitLenders === 0);
        setStatusCode(response.statusCode);

        // If API signals more lenders can be checked, hit all lenders and re-check status.
        // Re-hit only when API allows it and we are not in a lender-specific flow.
        if (response.isRehitLenders === 0 && !shouldSkipRehit) {
          const rehitResult = await hitAllLenders(mobile, token);
          if (rehitResult.success) {
            const refreshedResult = await checkStatusAll(mobile, token, signal);
            if (refreshedResult.success && refreshedResult.data) {
              const refreshedResponse = refreshedResult.data;
              setOffers(refreshedResponse.lenders || []);
              setCanReHit(refreshedResponse.isRehitLenders === 0);
              setStatusCode(refreshedResponse.statusCode);
            } else if (refreshedResult.error !== 'Request timed out') {
              setError(refreshedResult.error || 'Failed to refresh offers');
            }
          } else {
            setError(rehitResult.error || 'Failed to check for new offers');
          }
        }
      } else {
        // Don't show error toast if it's a timeout during polling
        if (result.error !== 'Request timed out') {
          setError(result.error || 'Failed to load offers');
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [enableMockData, isPolling, setOffers, setIsLoading, setError, setCanReHit, setStatusCode]);

  /**
   * Filter offers by status
   */
  const filterByStatus = useCallback(
    (status: WcStatus | 'ALL'): LenderOfferStatus[] => {
      return selectFilteredOffers(offers, status);
    },
    [offers]
  );

  /**
   * Calculate status counts for UI badges
   */
  const statusCounts = selectStatusCounts(offers);

  /**
   * Derived arrays for different offer categories
   */
  const exploreOffers = selectExploreOffers(offers);
  const statusOffers = selectStatusOffers(offers);

  /**
   * Stop polling and clear timers
   */
  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    pollStartTimeRef.current = null;
    setIsPolling(false);
  }, [setIsPolling]);

  /**
   * Logic for a single poll attempt
   */
  const executePoll = useCallback(async () => {
    // Check if we should stop: max duration reached
    if (pollStartTimeRef.current) {
      const elapsed = Date.now() - pollStartTimeRef.current;
      if (elapsed >= MAX_POLL_DURATION) {
        console.info('[useOffers] Max poll duration reached, stopping.');
        // Mark expiry so we don't restart polling without a fresh lead flow.
        didPollingExpireRef.current = true;
        stopPolling();
        return;
      }
    }

    // Prepare abort controller for this specific call's timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      await fetchOffers(controller.signal);
    } finally {
      clearTimeout(timeoutId);
      // Increment tick to schedule the next poll in the useEffect
      setPollTick(prev => prev + 1);
    }
  }, [fetchOffers, stopPolling]);

  // Handle polling lifecycle
  useEffect(() => {
    // Start polling ONLY if user just created a lead and we have no offers yet.
    // If we already hit max duration, don't re-enter polling until navigation changes.
    if (isNewLead && offers.length === 0 && !isPolling && !error && !didPollingExpireRef.current) {
      console.info('[useOffers] Starting polling for new lead offers...');
      setIsPolling(true);
      pollStartTimeRef.current = Date.now();
    }
    
    // Stop polling if offers arrive
    if (offers.length > 0 && isPolling) {
      console.info('[useOffers] Offers received, stopping poll.');
      stopPolling();
    }

    // Stop polling on error to avoid infinite retry loops
    if (error && isPolling) {
      console.error('[useOffers] Error during polling, stopping.');
      stopPolling();
    }
  }, [isNewLead, offers.length, isPolling, error, stopPolling, setIsPolling]);

  useEffect(() => {
    // Reset expiry when user is no longer in the new lead flow.
    if (!isNewLead) {
      didPollingExpireRef.current = false;
    }
  }, [isNewLead]);

  // Set up the next poll interval timer
  useEffect(() => {
    if (isPolling) {
      pollTimerRef.current = setTimeout(executePoll, POLL_INTERVAL);
    }
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, [isPolling, executePoll, pollTick]);

  // Initial fetch on mount (always refresh store, even if offers already exist)
  useEffect(() => {
    if (didInitialFetchRef.current) return;
    if (isPolling || error) return;
    didInitialFetchRef.current = true;
    fetchOffers();
  }, [fetchOffers, isPolling, error]);

  return {
    offers,
    exploreOffers,
    statusOffers,
    isLoading,
    isPolling,
    error,
    canReHit,
    isReHitting,
    statusCode,
    fetchOffers,
    reHitLenders,
    filterByStatus,
    statusCounts,
    selectedStatus,
    setSelectedStatus,
  };
}
