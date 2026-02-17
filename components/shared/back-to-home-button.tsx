'use client';

import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/shared';
import { JSX } from 'react';

export const BackToHomeButton = (): JSX.Element => {
  const router = useRouter();

  const handleBackToHome = (): void => {
    router.replace('/');
  };

  return (
    <div className="mb-6">
      <ActionButton
        type="button"
        onClick={handleBackToHome}
        variant="ghost"
        className="border-none shadow-none px-0"
        size="sm"
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        }
      >
        Back to Home
      </ActionButton>
    </div>
  );
};
