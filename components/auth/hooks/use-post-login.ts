import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Custom hook for handling post-login actions
 * Watches for successful login and executes pending actions
 * 
 * PDF Step 5A - Post Login Behaviour
 * After successful login, checks for pending action and executes it
 */
export const usePostLogin = (): void => {
  const router = useRouter();
  const { consumePendingAction } = useAuthStore();
  const wasAuthenticated = useRef(false);

  /**
   * PDF Step 5A - Post Login Behaviour
   * Watch for successful login and execute pending action
   */
  useEffect(() => {
    const { isAuthenticated } = useAuthStore.getState();
    
    // Detect transition from not authenticated to authenticated
    if (isAuthenticated && !wasAuthenticated.current) {
      // User just logged in - check for pending action
      const action = consumePendingAction();
      
      if (action) {
        console.info('[AuthModal] Executing pending action:', action.type, action.lenderId);
        
        // Execute the pending action based on type
        switch (action.type) {
          case 'navigate_to_offer':
          case 'check_eligibility':
            // Navigate to the offer/eligibility page
            // TODO: Add Check Status API call here before navigation (Step 6)
            router.push(action.href);
            break;
          default:
            console.warn('[AuthModal] Unknown pending action type:', action.type);
        }
      }
    }
    
    wasAuthenticated.current = isAuthenticated;
  }, [consumePendingAction, router]);
};
