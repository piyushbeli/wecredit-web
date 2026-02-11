import { useEffect } from 'react';

let activeLockCount = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';

const lockScroll = (): void => {
  if (typeof document === 'undefined') return;
  if (activeLockCount === 0) {
    // Store current overflow so we can restore it once all locks are released.
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  activeLockCount += 1;
};

const unlockScroll = (): void => {
  if (typeof document === 'undefined') return;
  if (activeLockCount === 0) return;
  activeLockCount -= 1;
  if (activeLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow;
  }
};

/**
 * Custom hook to lock/unlock body scroll
 * Prevents background scrolling when a modal or overlay is open
 *
 * @param isLocked - Whether body scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;
    // Reference counting avoids fights when multiple modals overlap.
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isLocked]);
}
