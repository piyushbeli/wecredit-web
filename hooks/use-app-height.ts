import { useEffect } from 'react';
import type { CSSProperties } from 'react';

/**
 * Provides a stable app-height style for mobile browsers.
 */
export const useAppHeight = (): CSSProperties => {
  useEffect((): (() => void) => {
    const updateAppHeight = (): void => {
      const viewportUnit: number = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-height', `${viewportUnit}px`);
    };
    updateAppHeight();
    window.addEventListener('resize', updateAppHeight);
    return (): void => {
      window.removeEventListener('resize', updateAppHeight);
    };
  }, []);
  return { minHeight: 'calc(var(--app-height, 1vh) * 100)' };
};
