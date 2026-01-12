'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Lender, ActiveLendersResponse } from '@/types/wecredit';
import { fetchActiveLenders, type WeCreditOptions } from '@/lib/api/wecredit';
import {
  ApiException,
  NoInternetException,
  RequestTimeoutException,
} from '@/lib/api/api-exceptions';

/** Hook state interface */
interface UseActiveLendersState {
  lenders: ActiveLendersResponse | null;
  isLoading: boolean;
  error: Error | null;
  errorType: 'network' | 'timeout' | 'api' | null;
}

/** Hook options interface */
interface UseActiveLendersOptions extends WeCreditOptions {
  /** Whether to fetch on mount (default: true) */
  fetchOnMount?: boolean;
}

/** Active lender with its ID */
export interface ActiveLender {
  id: string;
  lender: Lender;
}

/** Hook return interface */
interface UseActiveLendersReturn extends UseActiveLendersState {
  /** Refetch the lenders data */
  refetch: () => Promise<void>;
  /** Filtered active lenders array */
  activeLenders: ActiveLender[];
  /** Check if error is due to network issues */
  isNetworkError: boolean;
  /** Check if error is due to timeout */
  isTimeoutError: boolean;
}

/**
 * Determines the error type from an exception
 */
function getErrorType(error: unknown): 'network' | 'timeout' | 'api' | null {
  if (error instanceof NoInternetException) return 'network';
  if (error instanceof RequestTimeoutException) return 'timeout';
  if (error instanceof ApiException) return 'api';
  return null;
}

/**
 * Custom hook to fetch active lenders
 * Returns raw API data - transformation done at render time
 */
export function useActiveLenders(
  options: UseActiveLendersOptions = {}
): UseActiveLendersReturn {
  const { fetchOnMount = true, mobile, authorization, headers } = options;

  const [state, setState] = useState<UseActiveLendersState>({
    lenders: null,
    isLoading: fetchOnMount,
    error: null,
    errorType: null,
  });

  const fetchOptions = useMemo(
    () => ({ mobile, authorization, headers }),
    [mobile, authorization, headers]
  );

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null, errorType: null }));
    try {
      const lenders = await fetchActiveLenders(fetchOptions);
      setState({ lenders, isLoading: false, error: null, errorType: null });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch lenders');
      const errorType = getErrorType(err);
      setState(prev => ({ ...prev, isLoading: false, error, errorType }));
    }
  }, [fetchOptions]);

  /** Filtered active lenders computed from state */
  const activeLenders = useMemo((): ActiveLender[] => {
    console.log('[useActiveLenders] state.lenders type:', typeof state.lenders);
    console.log('[useActiveLenders] state.lenders:', state.lenders);
    if (!state.lenders) return [];
    
    // Check if it's a string (needs parsing) or already an object
    let lendersData: unknown = state.lenders;
    if (typeof state.lenders === 'string') {
      console.log('[useActiveLenders] Data is string, parsing...');
      try {
        lendersData = JSON.parse(state.lenders);
      } catch (e) {
        console.error('[useActiveLenders] Failed to parse string:', e);
        return [];
      }
    }
    
    // Check if data is an array or object
    const isArray = Array.isArray(lendersData);
    console.log('[useActiveLenders] isArray:', isArray);
    
    if (isArray) {
      // If array, filter directly
      const lendersArray = lendersData as Lender[];
      const filtered = lendersArray.filter((lender) => {
        return Number(lender.IsAppEnabled) === 1 && Number(lender.affiliateStatus) === 1;
      });
      console.log('[useActiveLenders] filtered array count:', filtered.length);
      return filtered.map((lender) => ({ id: String(lender.id || lender.Name), lender }));
    }
    
    // If object with keys
    const lendersObject = lendersData as Record<string, Lender>;
    const entries = Object.entries(lendersObject);
    console.log('[useActiveLenders] entries count:', entries.length);
    if (entries.length > 0) {
      console.log('[useActiveLenders] first entry:', entries[0]);
    }
    
    const filtered = entries.filter(([, lender]) => {
      return Number(lender.IsAppEnabled) === 1 && Number(lender.affiliateStatus) === 1;
    });
    console.log('[useActiveLenders] filtered count:', filtered.length);
    return filtered.map(([id, lender]) => ({ id, lender }));
  }, [state.lenders]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [fetchOnMount, fetchData]);

  return {
    ...state,
    refetch: fetchData,
    activeLenders,
    isNetworkError: state.errorType === 'network',
    isTimeoutError: state.errorType === 'timeout',
  };
}
