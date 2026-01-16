'use client';

import { useLoadingStore } from '@/stores/loading-store';
import { useCallback } from 'react';

/**
 * Custom hook for managing the global loading screen
 * Provides simple functions to show and hide the full-screen loading overlay.
 * 
 * @returns An object with showLoading and hideLoading functions
 */
export function useLoading() {
  const show = useLoadingStore((state) => state.show);
  const hide = useLoadingStore((state) => state.hide);
  const isVisible = useLoadingStore((state) => state.isVisible);

  /**
   * Shows the loading screen with optional custom messages
   */
  const showLoading = useCallback(
    (message?: string, subtext?: string) => {
      show({ message, subtext });
    },
    [show]
  );

  /**
   * Hides the loading screen
   */
  const hideLoading = useCallback(() => {
    hide();
  }, [hide]);

  return {
    showLoading,
    hideLoading,
    isLoading: isVisible,
  };
}
