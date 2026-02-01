'use client';

/**
 * Reusable state machine for loan form modals (home, business, car, gold).
 * Manages: loading (checking status) → form | success, with clear transitions.
 */

import { useCallback, useEffect, useState } from 'react';
import { isAbortError } from '@/lib/utils/error-helpers';
import { useLoadingStore } from '@/stores/loading-store';

export type LoanModalState = 'loading' | 'form' | 'success';

export interface UseLoanModalStateOptions {
  /**
   * Function to check if user has existing lead.
   * Returns true if lead exists (show success screen), false if not (show form).
   */
  checkStatus: (phoneNumber: string, signal: AbortSignal) => Promise<boolean>;
  /** Primary message shown during status check. */
  loadingMessage?: string;
  /** Secondary message shown during status check. */
  loadingSubtext?: string;
  /** When true, status check runs; when false, we stay in loading until ready. */
  isReady: boolean;
  /** User phone number passed to checkStatus. */
  phoneNumber?: string;
}

export interface UseLoanModalStateReturn {
  /** Current state: loading (checking), form (show form), success (show success screen). */
  state: LoanModalState;
  /** Call when form submission succeeds to show success screen. */
  transitionToSuccess: () => void;
  /** Call to force showing the form (e.g. after error recovery). */
  transitionToForm: () => void;
  /** True when state is 'loading'. */
  isLoading: boolean;
}

const DEFAULT_LOADING_MESSAGE = 'Checking your status...';
const DEFAULT_LOADING_SUBTEXT = 'Please wait while we fetch your details.';

/**
 * Hook that runs a status check on mount (when isReady and phoneNumber are set),
 * then transitions to 'form' or 'success'. Exposes transitionToSuccess for form submit.
 */
export function useLoanModalState(
  options: UseLoanModalStateOptions
): UseLoanModalStateReturn {
  const {
    checkStatus,
    loadingMessage = DEFAULT_LOADING_MESSAGE,
    loadingSubtext = DEFAULT_LOADING_SUBTEXT,
    isReady,
    phoneNumber,
  } = options;

  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const [state, setState] = useState<LoanModalState>('loading');

  const transitionToSuccess = useCallback((): void => {
    setState('success');
  }, []);

  const transitionToForm = useCallback((): void => {
    setState('form');
  }, []);

  // When not ready (e.g. not authenticated), show form so user can proceed; no status check.
  useEffect(() => {

    if (!isReady) {
      setState('form');
      return;
    }
    if (!phoneNumber) {
      return;
    }

    // Show loading screen during check (including when effect re-runs while form/success was shown).
    setState('loading');

    const controller = new AbortController();

    const runCheck = async (): Promise<void> => {
      showLoading({ message: loadingMessage, subtext: loadingSubtext });

      try {
        const hasExistingLead = await checkStatus(phoneNumber, controller.signal);
        setState(hasExistingLead ? 'success' : 'form');
      } catch (error) {
        if (isAbortError(error)) {
          // Request was cancelled (e.g. effect re-run); do not update state.
          return;
        }
        handleStatusCheckError(error);
      } finally {
        hideLoading();
      }
    };

    function handleStatusCheckError(error: unknown): void {
      setState('form');
    }

    runCheck();

    return () => {
      controller.abort();
      hideLoading();
    };
  }, [
    isReady,
    phoneNumber,
    checkStatus,
    loadingMessage,
    loadingSubtext,
    showLoading,
    hideLoading,
  ]);

  const isLoading = state === 'loading';

  return {
    state,
    transitionToSuccess,
    transitionToForm,
    isLoading,
  };
}
