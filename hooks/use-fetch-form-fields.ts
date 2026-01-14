'use client';

/**
 * Hook for fetching dynamic form fields from the lenders-form-filled API
 * Used in campaign forms to get lender-specific form configuration
 * 
 * CACHING: Form fields are cached in memory for 1 hour to avoid redundant API calls.
 * Cache is keyed by lenderName (empty string for all lenders).
 */

import { useState, useCallback } from 'react';
import { leadService } from '@/lib/api/lead-service';
import type { FormField } from '@/types/lead';

/** Cache entry structure */
interface CacheEntry {
  fields: FormField[];
  timestamp: number;
}

/** In-memory cache for form fields */
const formFieldsCache = new Map<string, CacheEntry>();

/** Cache TTL: 1 hour in milliseconds */
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Check if cache entry is valid (not expired)
 */
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * Get cached form fields for a lender
 */
function getCachedFields(lenderName: string): FormField[] | null {
  const cacheKey = lenderName || 'all';
  const cached = formFieldsCache.get(cacheKey);
  
  if (cached && isCacheValid(cached)) {
    console.log(`[FormFields] Cache hit for lender: ${cacheKey}`);
    return cached.fields;
  }
  
  // Remove expired cache entry
  if (cached) {
    formFieldsCache.delete(cacheKey);
  }
  
  return null;
}

/**
 * Store form fields in cache
 */
function setCachedFields(lenderName: string, fields: FormField[]): void {
  const cacheKey = lenderName || 'all';
  formFieldsCache.set(cacheKey, {
    fields,
    timestamp: Date.now(),
  });
  console.log(`[FormFields] Cached fields for lender: ${cacheKey}`);
}

/** Return type for useFetchFormFields hook */
interface UseFetchFormFieldsReturn {
  /** Array of form fields sorted by order */
  fields: FormField[];
  /** Loading state while fetching */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Function to fetch form fields for a lender */
  fetchFields: (lenderName: string, fetchDetails?: boolean) => Promise<void>;
  /** Reset fields and error state */
  reset: () => void;
  /** Clear cache for a specific lender (or all if no lenderName provided) */
  clearCache: (lenderName?: string) => void;
}

/**
 * Hook to fetch dynamic form fields for a specific lender
 * 
 * Features:
 * - Automatic caching with 1-hour TTL
 * - Returns cached data immediately if available
 * - Cache is keyed by lenderName (empty string for all lenders)
 * 
 * @returns Object containing fields, loading state, error, and fetch function
 * @example
 * ```tsx
 * const { fields, isLoading, error, fetchFields, clearCache } = useFetchFormFields();
 *
 * useEffect(() => {
 *   fetchFields('abfl', true); // Will use cache if available
 * }, [fetchFields]);
 * 
 * // Clear cache when needed
 * clearCache('abfl'); // Clear specific lender
 * clearCache(); // Clear all
 * ```
 */
export function useFetchFormFields(): UseFetchFormFieldsReturn {
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async (
    lenderName: string,
    fetchDetails: boolean = true
  ): Promise<void> => {
    // Check cache first
    const cachedFields = getCachedFields(lenderName);
    if (cachedFields) {
      setFields(cachedFields);
      setError(null);
      return;
    }

    // Cache miss - fetch from API
    setIsLoading(true);
    setError(null);
    
    const result = await leadService.fetchFormFields(lenderName, fetchDetails);
    
    if (result.success && result.data) {
      setFields(result.data);
      setCachedFields(lenderName, result.data);
    } else {
      setError(result.error || 'Failed to fetch form fields');
    }
    
    setIsLoading(false);
  }, []);

  const reset = useCallback((): void => {
    setFields([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const clearCache = useCallback((lenderName?: string): void => {
    if (lenderName !== undefined) {
      const cacheKey = lenderName || 'all';
      formFieldsCache.delete(cacheKey);
      console.log(`[FormFields] Cache cleared for lender: ${cacheKey}`);
    } else {
      formFieldsCache.clear();
      console.log('[FormFields] All cache cleared');
    }
  }, []);

  return {
    fields,
    isLoading,
    error,
    fetchFields,
    reset,
    clearCache,
  };
}
