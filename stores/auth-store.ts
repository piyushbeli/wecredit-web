import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * User data interface
 */
interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
}

/**
 * Auth modal step type
 */
type AuthStep = 'phone' | 'otp';

/**
 * Auth store state interface
 */
interface AuthState {
  /** Whether the auth modal is open */
  isModalOpen: boolean;
  /** Current step in the auth flow */
  currentStep: AuthStep;
  /** Phone number being authenticated */
  phoneNumber: string;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user data */
  user: User | null;
  /** Auth token */
  token: string | null;
  /** Loading state for API calls */
  isLoading: boolean;
  /** Error message */
  error: string | null;
}

/**
 * Auth store actions interface
 */
interface AuthActions {
  /** Open the auth modal */
  openModal: () => void;
  /** Close the auth modal and reset state */
  closeModal: () => void;
  /** Set current auth step */
  setStep: (step: AuthStep) => void;
  /** Set phone number */
  setPhoneNumber: (phoneNumber: string) => void;
  /** Set authenticated user */
  setUser: (user: User, token: string) => void;
  /** Clear auth and logout */
  logout: () => void;
  /** Set loading state */
  setLoading: (isLoading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Reset modal state (but keep auth state) */
  resetModalState: () => void;
}

/** Initial modal state */
const initialModalState = {
  isModalOpen: false,
  currentStep: 'phone' as AuthStep,
  phoneNumber: '',
  isLoading: false,
  error: null,
};

/** Initial auth state */
const initialAuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

/**
 * Zustand store for authentication state
 * Persists auth data (user, token) to localStorage
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialModalState,
        ...initialAuthState,

        openModal: () => set({ isModalOpen: true, error: null }),

        closeModal: () =>
          set({
            ...initialModalState,
          }),

        setStep: (step: AuthStep) => set({ currentStep: step, error: null }),

        setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),

        setUser: (user: User, token: string) =>
          set({
            isAuthenticated: true,
            user,
            token,
            isModalOpen: false,
            currentStep: 'phone',
            phoneNumber: '',
            isLoading: false,
            error: null,
          }),

        logout: () =>
          set({
            ...initialAuthState,
            ...initialModalState,
          }),

        setLoading: (isLoading: boolean) => set({ isLoading }),

        setError: (error: string | null) => set({ error, isLoading: false }),

        resetModalState: () => set(initialModalState),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

export type { User, AuthStep };
