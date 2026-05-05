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
 * Whether the floating panel and localStorage-backed flag toggles are active.
 *
 * Important: `NEXT_PUBLIC_*` values are inlined at `next build` time. For deployed staging,
 * your pipeline must set `NEXT_PUBLIC_ENVIRONMENT=staging` (see Dockerfile.staging) or
 * `NEXT_PUBLIC_ENABLE_DEV_TOOLS=true` before building — setting them only at runtime has no effect.
 */
const shouldShowFeatureFlagDevTools = (): boolean => {
  // Local `next dev` — no .env required (unlike relying only on NEXT_PUBLIC_*).
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // Explicit opt-in for non-local builds (e.g. staging preview URL with dev tools).
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS === 'true') {
    return true;
  }

  return false;
};

/**
 * Feature Flag Provider Component
 * Wraps the app and provides feature flag functionality
 * Active when: local dev (`next dev`), staging build, or `NEXT_PUBLIC_ENABLE_DEV_TOOLS=true`
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
    const devMode = shouldShowFeatureFlagDevTools();
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
      
      {/* Dev panel + toggles when shouldShowFeatureFlagDevTools() is true */}
      {isDevMode && (
        <>
          <FloatingToggleButton />
          <FeatureFlagPanel />
        </>
      )}
    </>
  );
}
