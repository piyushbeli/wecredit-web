import { useState, useCallback, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { checkStatusAll, hitAllLenders } from '@/lib/api/wecredit';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import type { LenderOfferStatus, CheckStatusAllResponse, WcStatus } from '@/types/wecredit';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { 
  MOCK_CHECK_STATUS_RESPONSE, 
  MOCK_REHIT_RESPONSE,
  simulateMockApiCall 
} from '@/lib/mock-data/offers';

/**
 * Hook return type
 */
interface UseOffersReturn {
  /** List of lender offers */
  offers: LenderOfferStatus[];
  /** Loading state for initial fetch */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Whether more lenders can be checked (isRehitLenders === 0) */
  canReHit: boolean;
  /** Loading state for re-hit operation */
  isReHitting: boolean;
  /** Status code from API */
  statusCode: string | null;
  /** Fetch offers (initial load or retry) */
  fetchOffers: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [canReHit, setCanReHit] = useState(false);
  const [isReHitting, setIsReHitting] = useState(false);
  const [statusCode, setStatusCode] = useState<string | null>(null);
  const enableMockData = useFeatureFlag('enableOfferMockData');
  /**
   * Fetch offers from API or mock data
   */
  const fetchOffers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
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

    if (!mobile) {
      setError('Mobile number not found. Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await checkStatusAll(mobile, token);

      if (result.success && result.data) {
        const response = result.data;
        setOffers(response.lenders || []);
        setCanReHit(response.isRehitLenders === 0);
        setStatusCode(response.statusCode);
      } else {
        setError(result.error || 'Failed to load offers');
        setOffers([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  }, [enableMockData]);

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
  };

  // Fetch offers on mount
  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    isLoading,
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
