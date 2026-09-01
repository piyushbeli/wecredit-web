'use client';

import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { ActionButton } from '@/components/shared';
import { FederationBankRedirectLoading } from '@/components/offers/federation-bank-redirect-loading';
import { FEDERATION_BANK_REDIRECT_COPY } from '@/lib/constants/federation-bank-redirect';
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
    return <FederationBankRedirectLoading />;
  }

  const { ERROR_TITLE, ERROR_FALLBACK_MESSAGE, DISMISS_LABEL } = FEDERATION_BANK_REDIRECT_COPY;
  const resolvedErrorMessage = errorMessage ?? ERROR_FALLBACK_MESSAGE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">{ERROR_TITLE}</h2>
        <p className="mb-6 text-gray-600">{resolvedErrorMessage}</p>
        <ActionButton type="button" onClick={onDismiss} className="mx-auto w-full max-w-xs">
          {DISMISS_LABEL}
        </ActionButton>
      </div>
    </div>
  );
};
