'use client';

import { getCookie } from 'cookies-next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { pollFederationBankRedirect } from '@/lib/api/federation-bank-redirect-service';
import { STORAGE_AUTH_TOKEN, STORAGE_MOBILE } from '@/lib/constants/api-keys';
import type { FederationBankRedirectOverlayState } from '@/components/offers/federation-bank-redirect-overlay.types';

export const useFederationBankRedirect = () => {
  const [redirectState, setRedirectState] = useState<FederationBankRedirectOverlayState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isPendingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const dismissFederationBankRedirect = useCallback((): void => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    isPendingRef.current = false;
    setRedirectState('idle');
    setErrorMessage(null);
  }, []);

  const handleFederationBankRedirect = useCallback(async (): Promise<void> => {
    if (isPendingRef.current) {
      return;
    }

    const mobile = getCookie(STORAGE_MOBILE) as string | undefined;
    const token = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;

    if (!mobile) {
      setErrorMessage('Mobile number required');
      setRedirectState('error');
      return;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    isPendingRef.current = true;
    setRedirectState('loading');
    setErrorMessage(null);

    const result = await pollFederationBankRedirect(mobile, token, abortController.signal);

    if (abortController.signal.aborted) {
      return;
    }

    if (!result.success) {
      isPendingRef.current = false;
      abortControllerRef.current = null;
      setErrorMessage(result.error ?? 'Unable to redirect to Federal Bank. Please try again.');
      setRedirectState('error');
    }
  }, []);

  return {
    redirectState,
    errorMessage,
    handleFederationBankRedirect,
    dismissFederationBankRedirect,
  };
};
