/**
 * Feature Flag Provider
 * Initializes feature flags and renders dev panel
 */

'use client';

import { useEffect } from 'react';
import { useFeatureFlagStore } from '@/stores/feature-flag-store';
import { FloatingToggleButton } from '@/components/dev/floating-toggle-button';
import { FeatureFlagPanel } from '@/components/dev/feature-flag-panel';

/**
 * Props for FeatureFlagProvider component
 */
interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

/**
 * Check if we're in development mode
 */
const isDevelopment = (): boolean => {
  // Check NEXT_PUBLIC_ENVIRONMENT
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
    return true;
  }
  
  // Check for explicit dev tools flag
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS === 'true') {
    return true;
  }
  
  return false;
};

/**
 * Feature Flag Provider Component
 * Wraps the app and provides feature flag functionality
 * Only active in development mode
 * 
 * @example
 * <FeatureFlagProvider>
 *   <YourApp />
 * </FeatureFlagProvider>
 */
export function FeatureFlagProvider({ children }: FeatureFlagProviderProps): React.ReactNode {
  const setDevMode = useFeatureFlagStore((state) => state.setDevMode);
  const isDevMode = useFeatureFlagStore((state) => state.isDevMode);

  /**
   * Initialize feature flags on mount
   * Set dev mode status and load flags from localStorage
   */
  useEffect(() => {
    const devMode = isDevelopment();
    setDevMode(devMode);

    if (devMode) {
      console.info(
        '%c[FeatureFlags] Development mode enabled',
        'color: #9333ea; font-weight: bold;'
      );
      console.info(
        '%c[FeatureFlags] Press Ctrl+Shift+F to open feature flags panel',
        'color: #9333ea;'
      );
    }
  }, [setDevMode]);

  return (
    <>
      {children}
      
      {/* Only render dev tools in development mode */}
      {isDevMode && (
        <>
          <FloatingToggleButton />
          <FeatureFlagPanel />
        </>
      )}
    </>
  );
}
