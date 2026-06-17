'use client';

import { useRouter } from 'next/navigation';
import { ActionButton } from '@/components/shared';
import { JSX } from 'react';

export const BackToHomeButton = (): JSX.Element => {
  const router = useRouter();

  const handleBackToHome = (): void => {
    router.push('/');
  };

  return (
    <div className="mb-6">
      <ActionButton
        type="button"
        onClick={handleBackToHome}
        variant="ghost"
        size="sm"
        title="Back to Home"
        aria-label="Back to Home"
        className="border-none cursor-pointer shadow-none px-0 transition-transform duration-150 hover:opacity-95 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600"
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-4 w-4"
            aria-hidden="true"
            focusable="false"
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
