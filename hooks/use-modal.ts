import { useState, useCallback } from 'react';

type UseModalResult = {
  readonly isOpen: boolean;
  readonly openModal: () => void;
  readonly closeModal: () => void;
};

/**
 * Provides reusable modal open/close state.
 */
export function useModal(): UseModalResult {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const openModal = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((): void => {
    setIsOpen(false);
  }, []);

  return { isOpen, openModal, closeModal };
}
