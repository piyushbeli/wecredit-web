/**
 * Hook for tracking credit card "Apply Now" clicks via the clicks_counter API.
 * Fire-and-forget: only called when user is logged in; errors are logged, not shown.
 */

import { getCookie } from 'cookies-next';
import { authService, fetchUserIp } from '@/lib/api/auth-service';
import { creditCardAnalytics } from '@/lib/api/credit-card-analytics';
import { STORAGE_MOBILE } from '@/lib/constants/api-keys';

/**
 * Returns a function to track credit card clicks.
 * Call it after opening the credit card URL (non-blocking).
 * No-op if user is not logged in or mobile is missing.
 */
export const useCreditCardTracking = () => {
  const trackCreditCardClick = (cardTitle: string): void => {
    // Only track for logged-in users; avoid unnecessary IP fetch for guests
    if (!authService.isUserLoggedIn()) {
      return;
    }

    const mobile = getCookie(STORAGE_MOBILE);
    if (!mobile || typeof mobile !== 'string') {
      return;
    }

    // Fire-and-forget: open URL already happened in the component.
    // We don't await so the UI is never blocked.
    void (async () => {
      const ip = await fetchUserIp();
      const result = await creditCardAnalytics.trackCreditCardClick(
        mobile,
        ip,
        cardTitle
      );
      if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging' && result.success) {
        // eslint-disable-next-line no-console
        console.debug('[CreditCardTracking] Click tracked:', cardTitle);
      }
    })();
  };

  return { trackCreditCardClick };
};
