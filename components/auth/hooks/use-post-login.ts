import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { submitBusinessLoanEnquiry } from '@/lib/api/business-loan-service';
import { submitCarLoanEnquiry } from '@/lib/api/car-loan-service';
import { submitHomeLoanEnquiry } from '@/lib/api/home-loan-service';
import { submitGoldLoanEnquiry } from '@/lib/api/gold-loan-service';
import {
  BUSINESS_LOAN_SUBMIT_SUCCESS_EVENT,
  CAR_LOAN_SUBMIT_SUCCESS_EVENT,
  HOME_LOAN_SUBMIT_SUCCESS_EVENT,
  GOLD_LOAN_SUBMIT_SUCCESS_EVENT,
} from '@/lib/constants/events';

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

      console.info('[Auth] usePostLogin: auth transition to authenticated', {
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
                  const success = await submitBusinessLoanEnquiry(action.businessLoanPayload);
                  console.info('[BL] usePostLogin: bl-leads API result', { success });
                  if (success) {
                    window.dispatchEvent(new CustomEvent(BUSINESS_LOAN_SUBMIT_SUCCESS_EVENT));
                    console.info('[BL] usePostLogin: dispatched', BUSINESS_LOAN_SUBMIT_SUCCESS_EVENT);
                  }
                } catch (err) {
                  console.error('[BL] usePostLogin: bl-leads API error', err);
                }
              })();
            } else {
              console.warn('[BL] usePostLogin: submit_business_loan but no businessLoanPayload');
            }
            break;
          case 'submit_car_loan':
            if (action.carLoanPayload) {
              console.info('[CL] usePostLogin: calling car loan API with stored payload');
              void (async (): Promise<void> => {
                try {
                  const success = await submitCarLoanEnquiry(action.carLoanPayload);
                  console.info('[CL] usePostLogin: car loan API result', { success });
                  if (success) {
                    window.dispatchEvent(new CustomEvent(CAR_LOAN_SUBMIT_SUCCESS_EVENT));
                    console.info('[CL] usePostLogin: dispatched', CAR_LOAN_SUBMIT_SUCCESS_EVENT);
                  }
                } catch (err) {
                  console.error('[CL] usePostLogin: car loan API error', err);
                }
              })();
            } else {
              console.warn('[CL] usePostLogin: submit_car_loan but no carLoanPayload');
            }
            break;
          case 'submit_home_loan':
            if (action.homeLoanPayload) {
              console.info('[HL] usePostLogin: calling home loan API with stored payload');
              void (async (): Promise<void> => {
                try {
                  const success = await submitHomeLoanEnquiry(action.homeLoanPayload);
                  console.info('[HL] usePostLogin: home loan API result', { success });
                  if (success) {
                    window.dispatchEvent(new CustomEvent(HOME_LOAN_SUBMIT_SUCCESS_EVENT));
                    console.info('[HL] usePostLogin: dispatched', HOME_LOAN_SUBMIT_SUCCESS_EVENT);
                  }
                } catch (err) {
                  console.error('[HL] usePostLogin: home loan API error', err);
                }
              })();
            } else {
              console.warn('[HL] usePostLogin: submit_home_loan but no homeLoanPayload');
            }
            break;
          case 'submit_gold_loan':
            if (action.goldLoanPayload) {
              console.info('[GL] usePostLogin: calling gold loan API with stored payload');
              void (async (): Promise<void> => {
                try {
                  const success = await submitGoldLoanEnquiry(action.goldLoanPayload);
                  console.info('[GL] usePostLogin: gold loan API result', { success });
                  if (success) {
                    window.dispatchEvent(new CustomEvent(GOLD_LOAN_SUBMIT_SUCCESS_EVENT));
                    console.info('[GL] usePostLogin: dispatched', GOLD_LOAN_SUBMIT_SUCCESS_EVENT);
                  }
                } catch (err) {
                  console.error('[GL] usePostLogin: gold loan API error', err);
                }
              })();
            } else {
              console.warn('[GL] usePostLogin: submit_gold_loan but no goldLoanPayload');
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
