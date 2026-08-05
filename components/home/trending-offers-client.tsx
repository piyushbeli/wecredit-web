'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { fetchActiveLendersForUser } from '@/lib/api/wecredit';
import { filterActiveLenders } from '@/lib/utils/lenders';
import { useFilteredActiveLenders } from '@/hooks/use-filtered-active-lenders';
import type { ActiveLender } from '@/lib/utils/lenders';
import TrendingOffersSection from './trending-offers-section';
import TrendingOffersSkeleton from './trending-offers-skeleton';
import { useAuthCookies } from '@/hooks/use-auth-cookies';

/**
 * Client wrapper for TrendingOffersSection
 * 
 * Implements PDF Steps 2 & 3:
 * - Step 2: Fetches generic lenders (client-side) when user is NOT logged in
 * - Step 3: Fetches user-specific lenders (client-side) when user IS logged in
 * 
 * Completely independent component - handles all lender fetching internally
 */
const TrendingOffersClient = ({
  heading = 'Trending Offers',
}: {
  heading?: string;
}): React.ReactNode => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // PDF Step 3: Fetch user-specific lenders when logged in
  const [userLenders, setUserLenders] = useState<ActiveLender[] | null>(null);
  const [isLoadingUserLenders, setIsLoadingUserLenders] = useState(false);
  const hasFetchedForUser = useRef<string | null>(null);

  // Single source of truth for auth state - but only after hydration
  const { mobile: mobileCookie, token: tokenCookie, hasAuthCookies } = useAuthCookies();
  
  // Derive a stable auth state that combines both sources intelligently
  // Only trust auth state after hydration to prevent SSR mismatch
  const authState = useMemo(() => {
    // During SSR or before hydration, assume not authenticated
    if (!isHydrated) {
      return {
        mobile: null,
        isAuthenticated: false,
      };
    }

    const mobile = mobileCookie || user?.phoneNumber;
    const isAuth = hasAuthCookies || isAuthenticated;
    
    return {
      mobile,
      isAuthenticated: isAuth && !!mobile,
    };
  }, [isHydrated, mobileCookie, user?.phoneNumber, hasAuthCookies, isAuthenticated]);

  // PDF Step 2: Fetch generic lenders (fallback). Only after hydration, when the
  // user is not authenticated, and only if the server didn't already provide them.
  const { activeLenders: genericLenders, isLoading: isLoadingGeneric } = useFilteredActiveLenders({
    fetchOnMount: isHydrated && !authState.isAuthenticated,
  });

  /**
   * PDF Step 3: Fetch user-specific lenders when user logs in
   * Only fetches once per user session (prevents duplicate calls)
   */
  useEffect(() => {
    // Ensure initial render matches server output to avoid hydration mismatch.
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchUserLenders = async (): Promise<void> => {
      // Don't fetch until hydration is complete
      if (!isHydrated) {
        return;
      }

      // User not authenticated - clear user lenders
      if (!authState.isAuthenticated || !authState.mobile) {
        setUserLenders(null);
        hasFetchedForUser.current = null;
        return;
      }

      // Already fetched for this user - skip
      if (hasFetchedForUser.current === authState.mobile) {
        return;
      }

      setIsLoadingUserLenders(true);

      try {
        const response = await fetchActiveLendersForUser(authState.mobile);
        const filteredLenders = filterActiveLenders(response);
        setUserLenders(filteredLenders);
        hasFetchedForUser.current = authState.mobile;
      } catch (error) {
        // Fall back to generic lenders on error
        setUserLenders(null);
      } finally {
        setIsLoadingUserLenders(false);
      }
    };

    fetchUserLenders();
  }, [isHydrated, authState.isAuthenticated, authState.mobile]);

  // Generic display prefers freshly-fetched client data, falling back to the
  // server-rendered initial lenders (present on first paint, avoids a skeleton).
  const genericDisplay = genericLenders.length > 0 ? genericLenders : [];

  // Determine which lenders to display
  // Priority: User-specific lenders (if logged in and fetched) > Generic lenders
  const displayLenders = authState.isAuthenticated && userLenders !== null
    ? userLenders
    : genericDisplay;

  // Show loading state if either generic or user-specific lenders are loading
  const isAnyLoading = isLoadingGeneric || (isLoadingUserLenders && authState.isAuthenticated);

  // With server-provided lenders we always have content, so never show the
  // skeleton (also keeps server and first-client render identical → no mismatch).
  const showSkeleton =
    (!isHydrated || (displayLenders.length === 0 && isAnyLoading));

  // Single stable root keyed by route so back/forward never reuses an Embla instance
  // from a different page (home vs personal-loan both mount this component).
  return (
    <div key={pathname} className="relative">
      {showSkeleton ? (
        <TrendingOffersSkeleton />
      ) : (
        <>
          {/* Subtle loading indicator when fetching lenders */}
          {isAnyLoading && (
            <div className="absolute top-2 right-4 z-10">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full shadow-sm">
                <span className="w-3 h-3 border-2 border-wc-blue-500/30 border-t-wc-blue-500 rounded-full animate-spin" />
                <span>{(isLoadingUserLenders && authState.isAuthenticated) ? 'Personalizing...' : 'Loading...'}</span>
              </div>
            </div>
          )}
          <TrendingOffersSection activeLenders={displayLenders} heading={heading} />
        </>
      )}
    </div>
  );
};

export default TrendingOffersClient;
