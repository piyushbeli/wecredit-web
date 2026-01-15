import { useState } from 'react';

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
  const openModal = (): void => {
    setIsOpen(true);
  };
  const closeModal = (): void => {
    setIsOpen(false);
  };
  return { isOpen, openModal, closeModal };
}
