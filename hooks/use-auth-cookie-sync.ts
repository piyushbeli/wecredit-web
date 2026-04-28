'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Hook to keep auth state (Zustand/localStorage) in sync with cookies.
 * Cookies are the source of truth for authentication.
 *
 * Sync triggers:
 * - Tab visibility change (catches clearing while tab was hidden)
 * - Window focus (catches clearing in DevTools then clicking back)
 * - Route/pathname change (catches clearing then SPA navigation)
 * - Periodic interval (catches clearing without any user action)
 *
 * @param intervalMs - Polling interval in milliseconds (default: 5000)
 */
export const useAuthCookieSync = (intervalMs: number = 5000): void => {
  const pathname = usePathname();
  const syncWithCookies = useAuthStore((state) => state.syncWithCookies);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        syncWithCookies();
      }
    };

    const handleFocus = (): void => {
      syncWithCookies();
    };

    // Periodic sync to catch cookie changes without requiring user interaction
    const intervalId = setInterval(() => {
      syncWithCookies();
    }, intervalMs);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [syncWithCookies, intervalMs]);

  // Sync on route changes (SPA navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    syncWithCookies();
  }, [pathname, syncWithCookies]);
};
