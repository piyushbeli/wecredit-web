'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getCookie } from 'cookies-next';
import { PercentIcon, CalendarIcon } from '../icons';
import ArrowBadge from '../ui/arrow-badge';
import { useAuth } from '@/hooks/use-auth';
import { ActionButton } from '../shared';
import { checkStatusAll } from '@/lib/api/wecredit';
import { STORAGE_MOBILE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import type { LenderOfferStatus } from '@/types/wecredit';

/** Props for TrendingOfferCard component */
interface TrendingOfferCardProps {
  /** Unique identifier (lender ID) */
  id: string;
  /** Lender name */
  lenderName: string;
  /** Lender logo path */
  logoPath?: string;
  /** Badge text (e.g., "Fast Disbursal") */
  badge?: string;
  /** Maximum loan amount */
  amount: string;
  /** Interest rate */
  interestRate: string;
  /** Loan tenure */
  tenure: string;
  /** CTA link */
  href: string;
  /** Animation delay index */
  index: number;
  /** Skip animation for carousel scrolling */
  skipAnimation?: boolean;
}

/**
 * Trending offer card component
 * Displays lender info with amount, rate, tenure and CTA
 * 
 * Flow (per PDF Step 5 - User Interaction with Trending Offers):
 * - 5A: If user NOT logged in → Show login modal, continue after success
 * - 5B: If user IS logged in → Proceed directly to check eligibility
 */
const TrendingOfferCard = ({
  id,
  lenderName,
  logoPath,
  badge,
  amount,
  interestRate,
  tenure,
  href,
  index,
  skipAnimation = false,
}: TrendingOfferCardProps): React.ReactNode => {
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithAction } = useAuth();

  // State for eligibility check loading (UI remains unchanged, only button disabled during check)
  const [isCheckingEligibility, setIsCheckingEligibility] = useState<boolean>(false);

  // Track component mount status to prevent state updates after unmount
  // This prevents memory leaks and React warnings when async operations complete
  const isMountedRef = useRef<boolean>(true);

  // AbortController for canceling API calls on unmount
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount: cancel any pending API calls and mark component as unmounted
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel any pending API request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Find lender in offers array by name (case-insensitive)
   * Returns the first matching lender or null if not found
   * 
   * Edge cases handled:
   * - Empty/null/undefined lenders array
   * - Empty/null/undefined lenderName
   * - Case-insensitive matching for flexibility
   */
  const findLenderInOffers = useCallback(
    (lenders: LenderOfferStatus[], searchName: string): LenderOfferStatus | null => {
      // Guard: Return null if lenders array is empty, null, or undefined
      if (!lenders || lenders.length === 0) {
        return null;
      }

      // Guard: Return null if lenderName is empty, null, or undefined
      if (!searchName || typeof searchName !== 'string') {
        return null;
      }

      // Case-insensitive search: normalize both names to lowercase
      const normalizedSearchName = searchName.toLowerCase().trim();

      // Find first matching lender
      const matchedLender = lenders.find((lender) => {
        // Guard: Skip lenders with missing or invalid lenderName
        if (!lender?.lenderName || typeof lender.lenderName !== 'string') {
          return false;
        }
        return lender.lenderName.toLowerCase().trim() === normalizedSearchName;
      });

      return matchedLender || null;
    },
    []
  );

  /**
   * Handle CTA button click
   * Per PDF Step 5: Check auth status before proceeding
   * 
   * Flow:
   * - If not authenticated: Show login modal
   * - If authenticated: Check eligibility via API
   *   - If lender found in offers: Navigate to offers status page
   *   - If lender not found: Navigate to lender page (normal flow)
   * 
   * Note: UI remains unchanged - card always displays the same content regardless of check result
   */
  const handleCheckEligibility = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();

      // PDF Step 5A: User Not Logged In → Show login first
      if (!isAuthenticated) {
        openAuthModalWithAction({
          type: 'check_eligibility',
          lenderId: id,
          lenderName,
          href,
        });
        return;
      }

      // Guard: Validate lenderName exists before proceeding
      if (!lenderName || typeof lenderName !== 'string') {
        console.error('[TrendingOfferCard] Invalid lenderName:', lenderName);
        // Fallback: Navigate to normal flow even if lenderName is invalid
        router.push(`/personal-loan/lender/${lenderName || 'unknown'}`);
        return;
      }

      // Guard: Prevent multiple simultaneous API calls (race condition protection)
      if (isCheckingEligibility) {
        return;
      }

      // Get mobile number from cookie - required for API call
      const mobile = getCookie(STORAGE_MOBILE) as string | undefined;

      // Guard: Early return if mobile number is missing
      // This shouldn't happen if user is authenticated, but we guard against it
      if (!mobile || typeof mobile !== 'string') {
        console.warn('[TrendingOfferCard] Mobile number not found, falling back to normal navigation');
        // Fallback: Allow normal navigation flow instead of blocking user
        router.push(`/personal-loan/lender/${lenderName}`);
        return;
      }

      // Get auth token (optional, can be undefined)
      const token = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Set loading state only if component is still mounted
      // This disables the button during check but doesn't change card UI
      if (isMountedRef.current) {
        setIsCheckingEligibility(true);
      }

      try {
        // Call check-status-all API to get user's existing offers
        const result = await checkStatusAll(mobile, token, abortController.signal);

        // Guard: Check if component is still mounted before updating state
        // Prevents "Can't perform a React state update on an unmounted component" warning
        if (!isMountedRef.current) {
          return;
        }

        // Handle API error response
        if (!result.success || !result.data) {
          setIsCheckingEligibility(false);
          // Fallback: Don't block user - allow normal navigation
          router.push(`/personal-loan/lender/${lenderName}`);
          return;
        }

        // Guard: Validate response data structure
        const { lenders } = result.data;
        if (!lenders || !Array.isArray(lenders)) {
          console.warn('[TrendingOfferCard] Invalid lenders array in API response');
          setIsCheckingEligibility(false);
          // Fallback: Navigate normally if response structure is invalid
          router.push(`/personal-loan/lender/${lenderName}`);
          return;
        }

        // Search for current lender in the offers list
        const matchedLender = findLenderInOffers(lenders, lenderName);

        // Reset loading state before navigation
        setIsCheckingEligibility(false);

        if (matchedLender) {
          // Lender found: User is already a lead for this lender
          // Navigate to offers status page instead of lender form
          router.push('/offers/');
        } else {
          // Lender not found: User hasn't applied to this lender yet
          // Proceed with normal flow (navigate to lender page)
          router.push(`/personal-loan/lender/${lenderName}`);
        }
      } catch (error) {
        // Guard: Only update state if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        // Handle AbortError (request was cancelled, e.g., on unmount)
        if (error instanceof Error && error.name === 'AbortError') {
          // Don't update state for aborted requests - component may be unmounting
          return;
        }

        // Handle other errors
        const errorMessage = error instanceof Error
          ? error.message
          : 'An unexpected error occurred';

        console.error('[TrendingOfferCard] Error checking eligibility:', errorMessage);
        setIsCheckingEligibility(false);

        // Fallback: Never block user - allow normal navigation on error
        router.push(`/personal-loan/lender/${lenderName}`);
      } finally {
        // Cleanup: Reset loading state if component is still mounted
        if (isMountedRef.current) {
          // Loading state is already reset in success/error paths above
          // This is a safety net in case of unexpected code paths
          abortControllerRef.current = null;
        }
      }
    },
    [
      isAuthenticated,
      openAuthModalWithAction,
      id,
      lenderName,
      href,
      router,
      isCheckingEligibility,
      findLenderInOffers,
    ]
  );


  return (
    <motion.div
      initial={skipAnimation ? false : { opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={skipAnimation ? { duration: 0 } : {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
      className="w-full h-full"
    >
      {/* Outer white container */}
      <div
        className="relative rounded-3xl h-full overflow-hidden bg-white border border-gray-200"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Gradient content area */}
        <div
          className="relative p-3 pb-4"
          style={{
            background: 'linear-gradient(145deg, #D4E4FC 0%, #EEF4FF 50%, #FAFCFF 100%)',
          }}
        >
          {/* Ribbon Badge - Arrow style positioned at top right corner */}
          {badge && (
            <div className="absolute right-0 top-4">
              <ArrowBadge text={badge} />
            </div>
          )}

          {/* Header: Logo */}
          <div className="flex items-center mb-1">
            {/* {logoPath && <Image
              src={logoPath || ''}
              alt={lenderName}
              width={100}
              height={10}
              className="object-contain h-5 w-auto"
              priority
            />} */}
          </div>

          {/* Card Content - Always shows original offer details (UI unchanged) */}
          <>
            {/* Amount - Italic blue text */}
            <h3 className="font-medium text-sm mb-1">
              Amount upto {amount}
            </h3>

            {/* Rate & Tenure - With proper icons */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <PercentIcon />
                <span className="text-gray-500 text-xs font-light">Int. rate {interestRate}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon />
                <span className="text-gray-500 text-xs font-light">Upto {tenure}</span>
              </div>
            </div>
          </>
        </div>

        {/* CTA Button - On white background outside gradient */}
        {/* Button shows loading state during check, otherwise always "Check Eligibility" */}
        <div className="p-2 bg-white">
          <ActionButton
            type="button"
            onClick={handleCheckEligibility}
            disabled={isCheckingEligibility}
            fullWidth
            className="text-xs font-medium rounded-full py-1 h-6"
          >
            {isCheckingEligibility ? 'Checking...' : 'Check Eligibility'}
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingOfferCard;
