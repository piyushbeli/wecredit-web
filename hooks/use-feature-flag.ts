/**
 * Feature Flag Hooks
 * Provides hooks to access and manage feature flags
 */

import { useFeatureFlagStore } from '@/stores/feature-flag-store';
import type { FeatureFlagName, FeatureFlags } from '@/lib/constants/feature-flags';

/**
 * Hook to get a single feature flag value
 * Automatically handles dev mode checking
 * 
 * @param flagName - Name of the feature flag
 * @returns Current value of the feature flag (false in production)
 * 
 * @example
 * const showLeadForm = useFeatureFlag('showLeadForm');
 * if (showLeadForm) {
 *   return <LeadForm />;
 * }
 */
export function useFeatureFlag(flagName: FeatureFlagName): boolean {
  const getFlag = useFeatureFlagStore((state) => state.getFlag);
  const isDevMode = useFeatureFlagStore((state) => state.isDevMode);
  
  // In production, always return false
  if (!isDevMode) {
    return false;
  }
  
  return getFlag(flagName);
}

/**
 * Hook to access all feature flags and methods
 * 
 * @returns Object containing all flags and methods to manage them
 * 
 * @example
 * const { flags, setFlag, resetFlags } = useFeatureFlags();
 * 
 * // Update a flag
 * setFlag('showLeadForm', true);
 * 
 * // Reset all flags
 * resetFlags();
 */
export function useFeatureFlags() {
  const flags = useFeatureFlagStore((state) => state.flags);
  const isDevMode = useFeatureFlagStore((state) => state.isDevMode);
  const setFlag = useFeatureFlagStore((state) => state.setFlag);
  const setFlags = useFeatureFlagStore((state) => state.setFlags);
  const resetFlags = useFeatureFlagStore((state) => state.resetFlags);
  const getFlag = useFeatureFlagStore((state) => state.getFlag);
  const exportFlags = useFeatureFlagStore((state) => state.exportFlags);
  const importFlags = useFeatureFlagStore((state) => state.importFlags);
  
  return {
    flags,
    isDevMode,
    setFlag,
    setFlags,
    resetFlags,
    getFlag,
    exportFlags,
    importFlags,
  };
}

/**
 * Hook to update a single feature flag
 * 
 * @returns Function to update a feature flag
 * 
 * @example
 * const updateFlag = useUpdateFeatureFlag();
 * updateFlag('showLeadForm', true);
 */
export function useUpdateFeatureFlag() {
  const setFlag = useFeatureFlagStore((state) => state.setFlag);
  const isDevMode = useFeatureFlagStore((state) => state.isDevMode);
  
  return (flagName: FeatureFlagName, value: boolean): void => {
    // Only allow updates in dev mode
    if (!isDevMode) {
      console.warn('[FeatureFlags] Cannot update flags in production mode');
      return;
    }
    
    setFlag(flagName, value);
  };
}

/**
 * Hook to access dev panel state
 * 
 * @returns Object containing panel state and toggle function
 * 
 * @example
 * const { isPanelOpen, togglePanel } = useDevPanel();
 */
export function useDevPanel() {
  const isPanelOpen = useFeatureFlagStore((state) => state.isPanelOpen);
  const togglePanel = useFeatureFlagStore((state) => state.togglePanel);
  const isDevMode = useFeatureFlagStore((state) => state.isDevMode);
  
  return {
    isPanelOpen,
    togglePanel,
    isDevMode,
  };
}

/**
 * Check if development mode is enabled
 * 
 * @returns true if in development mode
 */
export function useIsDevMode(): boolean {
  return useFeatureFlagStore((state) => state.isDevMode);
}
