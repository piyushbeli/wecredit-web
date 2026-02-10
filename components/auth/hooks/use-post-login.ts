import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { submitBusinessLoanEnquiry } from '@/lib/api/business-loan-service';

/**
 * Custom hook for handling post-login actions
 * Watches for successful login and executes pending actions
 * 
 * PDF Step 5A - Post Login Behaviour
 * After successful login, checks for pending action and executes it
 */
export const usePostLogin = (): void => {
  const router = useRouter();
  const { isAuthenticated, consumePendingAction } = useAuthStore();
  const wasAuthenticated = useRef(false);

  /**
   * PDF Step 5A - Post Login Behaviour
   * Watch for successful login and execute pending action.
   * Must depend on isAuthenticated so the effect re-runs when login completes
   * (setUser closes the modal but this hook runs in layout; we need to react to auth change).
   */
  useEffect(() => {
    // Detect transition from not authenticated to authenticated
    if (isAuthenticated && !wasAuthenticated.current) {
      const action = consumePendingAction();

      console.info('[BL] usePostLogin: auth transition to authenticated', {
        hadPendingAction: !!action,
        actionType: action?.type,
      });

      if (action) {
        console.info('[AuthModal] Executing pending action:', action.type, action.lenderId);

        switch (action.type) {
          case 'navigate_to_offer':
          case 'check_eligibility':
            if (action.href) {
              router.push(action.href);
            }
            break;
          case 'submit_business_loan':
            if (action.businessLoanPayload) {
              console.info('[BL] usePostLogin: calling bl-leads API with stored payload');
              void (async (): Promise<void> => {
                try {
                  const success = await submitBusinessLoanEnquiry(action.businessLoanPayload!);
                  console.info('[BL] usePostLogin: bl-leads API result', { success });
                  if (success) {
                    window.dispatchEvent(new CustomEvent('business-loan-submit-success'));
                    console.info('[BL] usePostLogin: dispatched business-loan-submit-success');
                  }
                } catch (err) {
                  console.error('[BL] usePostLogin: bl-leads API error', err);
                }
              })();
            } else {
              console.warn('[BL] usePostLogin: submit_business_loan but no businessLoanPayload');
            }
            break;
          default:
            console.warn('[AuthModal] Unknown pending action type:', action.type);
        }
      }
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, consumePendingAction, router]);
};
