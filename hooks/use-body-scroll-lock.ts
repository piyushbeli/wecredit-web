import { useEffect, useRef } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Prevents background scrolling when a modal or overlay is open
 * 
 * @param isLocked - Whether body scroll should be locked
 */
export function useBodyScrollLock(isLocked: boolean): void {
  const originalOverflowRef = useRef<string>('');

  useEffect(() => {
    if (isLocked) {
      // Store current overflow value
      originalOverflowRef.current = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore original overflow value
      document.body.style.overflow = originalOverflowRef.current;
    }
    
    // Cleanup: restore scroll on unmount
    return () => {
      document.body.style.overflow = originalOverflowRef.current || '';
    };
  }, [isLocked]);
}
