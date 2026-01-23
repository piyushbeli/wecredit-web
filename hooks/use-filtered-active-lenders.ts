'use client'
/**
 * Hook to fetch and filter active lenders
 * Provides a clean interface for components that need filtered lender data
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchActiveLenders, type WeCreditOptions } from '@/lib/api/wecredit';
import { filterActiveLenders } from '@/lib/utils/lenders';
import type { ActiveLender } from '@/lib/utils/lenders';

/** Hook options */
interface UseFilteredActiveLendersOptions extends WeCreditOptions {
  /** Whether to fetch on mount (default: true) */
  fetchOnMount?: boolean;
}

/** Hook return interface */
interface UseFilteredActiveLendersReturn {
  /** Filtered active lenders */
  activeLenders: ActiveLender[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and filter active lenders
 * Handles fetching, filtering, and state management
 */
export function useFilteredActiveLenders(
  options: UseFilteredActiveLendersOptions = {}
): UseFilteredActiveLendersReturn {
  const { fetchOnMount = true, mobile, authorization, headers } = options;
  const [activeLenders, setActiveLenders] = useState<ActiveLender[]>([]);
  const [isLoading, setIsLoading] = useState(fetchOnMount);
  const [error, setError] = useState<Error | null>(null);

  const apiOptions = useMemo(
    () => ({ mobile, authorization, headers }),
    [mobile, authorization, headers]
  );

  const fetchLenders = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const lendersResponse = await fetchActiveLenders(apiOptions);
      const filteredLenders = filterActiveLenders(lendersResponse);
      setActiveLenders(filteredLenders);
    } catch (err) {
      const apiError = err instanceof Error ? err : new Error('Failed to fetch lenders');
      setError(apiError);
      setActiveLenders([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiOptions]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchLenders();
    }
  }, [fetchOnMount]);

  return {
    activeLenders,
    isLoading,
    error,
    refetch: fetchLenders,
  };
}
