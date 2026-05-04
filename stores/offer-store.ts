import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { LenderOfferStatus, WcStatus } from '@/types/wecredit';
import { categorizeOffers } from '@/lib/utils/offer-categorization';

/**
 * Selected status filter type
 */
type StatusFilter = WcStatus | 'ALL';

/**
 * Offer store state interface
 */
interface OfferState {
  /** List of lender offers */
  offers: LenderOfferStatus[];
  /** Loading state for initial fetch */
  isLoading: boolean;
  /** Whether the store is currently polling for offers */
  isPolling: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Whether more lenders can be checked (isRehitLenders === 0) */
  canReHit: boolean;
  /** Loading state for re-hit operation */
  isReHitting: boolean;
  /** Status code from API */
  statusCode: string | null;
  /** Optional salary value returned by check-status-all for GTM tracking. */
  declaredSalary: number | string | null;
  /** Optional employment type returned by check-status-all for GTM tracking. */
  empType: string | null;
  /** Currently selected status filter */
  selectedStatus: StatusFilter;
}

/**
 * Offer store actions interface
 */
interface OfferActions {
  /** Set offers list */
  setOffers: (offers: LenderOfferStatus[]) => void;
  /** Set loading state */
  setIsLoading: (isLoading: boolean) => void;
  /** Set polling state */
  setIsPolling: (isPolling: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Set canReHit flag */
  setCanReHit: (canReHit: boolean) => void;
  /** Set re-hitting state */
  setIsReHitting: (isReHitting: boolean) => void;
  /** Set status code */
  setStatusCode: (statusCode: string | null) => void;
  /** Save optional lead fields returned by check-status-all. */
  setOfferTrackingMeta: (declaredSalary: number | string | null, empType: string | null) => void;
  /** Set selected status filter */
  setSelectedStatus: (status: StatusFilter) => void;
  /** Reset store to initial state */
  reset: () => void;
}

/** Initial offer state */
const initialState: OfferState = {
  offers: [],
  isLoading: true,
  isPolling: false,
  error: null,
  canReHit: false,
  isReHitting: false,
  statusCode: null,
  declaredSalary: null,
  empType: null,
  selectedStatus: 'ALL',
};

/**
 * Zustand store for offer state management
 * Uses devtools middleware for Redux DevTools integration
 */
export const useOfferStore = create<OfferState & OfferActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setOffers: (offers: LenderOfferStatus[]) => set({ offers }, false, 'setOffers'),

      setIsLoading: (isLoading: boolean) => set({ isLoading }, false, 'setIsLoading'),

      setIsPolling: (isPolling: boolean) => set({ isPolling }, false, 'setIsPolling'),

      setError: (error: string | null) => set({ error }, false, 'setError'),

      setCanReHit: (canReHit: boolean) => set({ canReHit }, false, 'setCanReHit'),

      setIsReHitting: (isReHitting: boolean) => set({ isReHitting }, false, 'setIsReHitting'),

      setStatusCode: (statusCode: string | null) => set({ statusCode }, false, 'setStatusCode'),

      setOfferTrackingMeta: (declaredSalary: number | string | null, empType: string | null) =>
        set({ declaredSalary, empType }, false, 'setOfferTrackingMeta'),

      setSelectedStatus: (selectedStatus: StatusFilter) =>
        set({ selectedStatus }, false, 'setSelectedStatus'),

      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'offer-store',
    }
  )
);

/**
 * Selector: Filter offers by status
 */
export const selectFilteredOffers = (
  offers: LenderOfferStatus[],
  status: StatusFilter
): LenderOfferStatus[] => {
  if (status === 'ALL') {
    return offers;
  }
  return offers.filter((offer) => offer.wcStatus === status);
};

/**
 * Selector: Explore list (INITIATED) for lenders with active lenderStatus (or legacy omit).
 */
export const selectExploreOffers = (offers: LenderOfferStatus[]): LenderOfferStatus[] => {
  return categorizeOffers(offers).explore;
};

/**
 * Selector: Recently-clicked / status-tracked offers (non-INITIATED, non-DISBURSED) for active lenders.
 */
export const selectStatusOffers = (offers: LenderOfferStatus[]): LenderOfferStatus[] => {
  return categorizeOffers(offers).recentlyClicked;
};

/**
 * Selector: Rejected-style offers for inactive lenders (lenderStatus === false).
 */
export const selectUnmatchedOffers = (offers: LenderOfferStatus[]): LenderOfferStatus[] => {
  return categorizeOffers(offers).unmatched;
};

/**
 * Selector: Calculate status counts for UI badges
 */
export const selectStatusCounts = (
  offers: LenderOfferStatus[]
): Record<StatusFilter, number> => {
  return {
    ALL: offers.length,
    NOT_PROCESSED: offers.filter((o) => o.wcStatus === 'NOT_PROCESSED').length,
    INITIATED: offers.filter((o) => o.wcStatus === 'INITIATED').length,
    ELIGIBILITY_REJECTED: offers.filter((o) => o.wcStatus === 'ELIGIBILITY_REJECTED').length,
    UTM_CLICKED: offers.filter((o) => o.wcStatus === 'UTM_CLICKED').length,
    JOURNEY_STARTED: offers.filter((o) => o.wcStatus === 'JOURNEY_STARTED').length,
    UNDER_REVIEW: offers.filter((o) => o.wcStatus === 'UNDER_REVIEW').length,
    PENDING: offers.filter((o) => o.wcStatus === 'PENDING').length,
    APPROVED: offers.filter((o) => o.wcStatus === 'APPROVED').length,
    REJECTED: offers.filter((o) => o.wcStatus === 'REJECTED').length,
    DISBURSED: offers.filter((o) => o.wcStatus === 'DISBURSED').length,
    COMPLETED: offers.filter((o) => o.wcStatus === 'COMPLETED').length,
    CANCELLED: offers.filter((o) => o.wcStatus === 'CANCELLED').length,
  };
};

export type { StatusFilter };
