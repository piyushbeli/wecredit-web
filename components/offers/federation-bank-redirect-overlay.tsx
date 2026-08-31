'use client';

import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { PollingState } from '@/components/offers/polling-state';
import { ActionButton } from '@/components/shared';
import type { FederationBankRedirectOverlayProps } from '@/components/offers/federation-bank-redirect-overlay.types';

export const FederationBankRedirectOverlay = ({
  state,
  errorMessage,
  onDismiss,
}: FederationBankRedirectOverlayProps) => {
  const isVisible = state !== 'idle';
  useBodyScrollLock(isVisible);

  if (!isVisible) {
    return null;
  }

  if (state === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
        <PollingState message="Connecting you to Federal Bank. This may take up to 30 seconds..." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Unable to redirect</h2>
        <p className="mb-6 text-gray-600">
          {errorMessage ?? 'Something went wrong. Please try again.'}
        </p>
        <ActionButton type="button" onClick={onDismiss} className="mx-auto w-full max-w-xs">
          Close
        </ActionButton>
      </div>
    </div>
  );
};
