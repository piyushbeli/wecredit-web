import { StatusFilter } from "@/stores/offer-store";
import { LenderOfferStatus, WcStatus } from "./wecredit";

/**
 * Hook return type
 */
export interface UseOffersReturn {
    /** List of lender offers */
    offers: LenderOfferStatus[];
    /** Explore offers: active lender + INITIATED (see offer-categorization) */
    exploreOffers: LenderOfferStatus[];
    /** Recently clicked / in-journey: active lender, not INITIATED, not DISBURSED */
    statusOffers: LenderOfferStatus[];
    /** Inactive-lender outcomes shown in the Unmatched section (REJECTED / NOT_PROCESSED when lenderStatus is false) */
    unmatchedOffers: LenderOfferStatus[];
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
    /** Currently selected status filter */
    selectedStatus: StatusFilter;
    /** Set selected status filter */
    setSelectedStatus: (status: StatusFilter) => void;
    shouldTriggerApply: boolean;

  }