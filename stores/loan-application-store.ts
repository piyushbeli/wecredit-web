import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Loan Application Store State
 * Manages trigger state for initiating the loan application flow
 */
interface LoanApplicationState {
  /** Flag to trigger the loan application flow */
  triggerApply: boolean;
  /** Shared loading state for apply flow buttons */
  isApplyLoading: boolean;
}

/**
 * Loan Application Store Actions
 */
interface LoanApplicationActions {
  /** Trigger the loan application flow (auth check -> dedupe -> modal) */
  triggerApplyFlow: () => void;
  /** Reset the trigger flag after handling */
  resetTrigger: () => void;
  /** Sync loading state across all apply buttons */
  setApplyLoading: (isLoading: boolean) => void;
}

/**
 * Zustand store for managing loan application flow triggers
 * Used by hero-section and how-to-apply-steps to trigger the modal flow
 * PersonalLoanContent watches this store and executes the flow
 */
export const useLoanApplicationStore = create<LoanApplicationState & LoanApplicationActions>()(
  devtools(
    (set) => ({
      triggerApply: false,
      isApplyLoading: false,

      triggerApplyFlow: () => set({ triggerApply: true }),

      resetTrigger: () => set({ triggerApply: false }),

      setApplyLoading: (isLoading: boolean) => set({ isApplyLoading: isLoading }),
    }),
    {
      name: 'loan-application-store',
    }
  )
);
