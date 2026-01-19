import { useState, useCallback, useEffect, useRef } from 'react';
import { getCookie } from 'cookies-next';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { checkStatusAll, hitAllLenders } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import type { LenderOfferStatus, CheckStatusAllResponse, WcStatus } from '@/types/wecredit';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { MOCK_CHECK_STATUS_RESPONSE, MOCK_REHIT_RESPONSE, simulateMockApiCall } from '@/lib/mock-data/offers';

/** Polling constants */
const POLL_INTERVAL = 15000; // 15 seconds
const MAX_POLL_DURATION = 90000; // 90 seconds
const API_TIMEOUT = 15000; // 15 seconds

/**
 * Hook return type
 */
interface UseOffersReturn {
  /** List of lender offers */
  offers: LenderOfferStatus[];
  /** Loading state for initial fetch */
  isLoading: boolean;
  /** Whether the hook is currently polling for offers */
  isPolling: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Whether more lenders can be checked (isRehitLenders === 0) */
  canReHit: boolean;
  /** Loading state for re-hit operation */
  isReHitting: boolean;
  /** Status code from API */
  statusCode: string | null;
  /** Fetch offers (initial load or retry) */
  fetchOffers: (signal?: AbortSignal) => Promise<void>;
  /** Re-hit all lenders to find more offers */
  reHitLenders: () => Promise<void>;
  /** Filter offers by status */
  filterByStatus: (status: WcStatus | 'ALL') => LenderOfferStatus[];
  /** Count of offers by status */
  statusCounts: Record<WcStatus | 'ALL', number>;
}

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
 * 
 * @returns Offers data and management functions
 */
export function useOffers(): UseOffersReturn {
  const [offers, setOffers] = useState<LenderOfferStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canReHit, setCanReHit] = useState(false);
  const [isReHitting, setIsReHitting] = useState(false);
  const [statusCode, setStatusCode] = useState<string | null>(null);
  const [pollTick, setPollTick] = useState(0);
  
  const searchParams = useSearchParams();
  const isNewLead = searchParams?.get('newLead') === 'true';
  const enableMockData = useFeatureFlag('enableOfferMockData');
  
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number | null>(null);

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
        const mockResponse = await simulateMockApiCall(MOCK_CHECK_STATUS_RESPONSE);
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
  }, [enableMockData, isPolling]);

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
  }, [canReHit, enableMockData]);

  /**
   * Filter offers by status
   */
  const filterByStatus = useCallback(
    (status: WcStatus | 'ALL'): LenderOfferStatus[] => {
      if (status === 'ALL') {
        return offers;
      }
      return offers.filter((offer) => offer.wcStatus === status);
    },
    [offers]
  );

  /**
   * Calculate status counts for UI badges
   */
  const statusCounts: Record<WcStatus | 'ALL', number> = {
    ALL: offers.length,
    INITIATED: offers.filter((o) => o.wcStatus === 'INITIATED').length,
    PENDING: offers.filter((o) => o.wcStatus === 'PENDING').length,
    APPROVED: offers.filter((o) => o.wcStatus === 'APPROVED').length,
    REJECTED: offers.filter((o) => o.wcStatus === 'REJECTED').length,
    DISBURSED: offers.filter((o) => o.wcStatus === 'DISBURSED').length,
    COMPLETED: offers.filter((o) => o.wcStatus === 'COMPLETED').length,
    CANCELLED: offers.filter((o) => o.wcStatus === 'CANCELLED').length,
    UNDER_REVIEW: offers.filter((o) => o.wcStatus === 'UNDER_REVIEW').length,
    UTM_CLICKED: offers.filter((o) => o.wcStatus === 'UTM_CLICKED').length,
  };

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
  }, []);

  /**
   * Logic for a single poll attempt
   */
  const executePoll = useCallback(async () => {
    // Check if we should stop: max duration reached
    if (pollStartTimeRef.current) {
      const elapsed = Date.now() - pollStartTimeRef.current;
      if (elapsed >= MAX_POLL_DURATION) {
        console.info('[useOffers] Max poll duration reached, stopping.');
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
    // Start polling ONLY if user just created a lead and we have no offers yet
    if (isNewLead && offers.length === 0 && !isPolling && !error) {
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
  }, [isNewLead, offers.length, isPolling, error, stopPolling]);

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

  // Initial fetch (Case B: No polling, or Case A: First attempt)
  useEffect(() => {
    if (!isPolling && offers.length === 0 && !error) {
       fetchOffers();
    }
  }, [fetchOffers, isPolling, offers.length, error]);

  return {
    offers,
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
  };
}
