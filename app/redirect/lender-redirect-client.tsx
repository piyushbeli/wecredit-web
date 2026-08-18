'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { forwardLenderRedirectByPhone } from '@/lib/api/wecredit';
import { toast } from 'sonner';
import {
  PARAM_LNT_REDIRECT_PHONE,
  STORAGE_AUTH_TOKEN,
} from '@/lib/constants/api-keys';
import { getCookie } from 'cookies-next';
import { getLenderNameFromUrl, isValidMobile } from '@/lib/utils/common-helper';

const LenderRedirectClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mobileParam = searchParams.get(PARAM_LNT_REDIRECT_PHONE);
  const lenderNameParam = getLenderNameFromUrl(searchParams);

  useEffect(() => {

    if (!mobileParam) {
      return;
    }

    if (!lenderNameParam) {
      const message = 'A lender name is required in the URL to continue.';
      setError(message);
      setIsLoading(false);
      toast.error(message);
      return;
    }

    setIsLoading(true);

    const runRedirect = async () => {
      try {
        const token: string | undefined = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;
        const result = await forwardLenderRedirectByPhone(mobileParam, lenderNameParam, token);
        if (!result.success) {
          const message = result.error || 'Unable to start your journey. Please try again.';
          setError(message);
          setIsLoading(false);
          toast.error(message);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Something went wrong while processing your request.';
        setError(message);
        setIsLoading(false);
        toast.error(message);
      }
    };

    void runRedirect();
  }, [mobileParam, lenderNameParam]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-xl font-semibold">Redirecting you to your offer...</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we securely connect you to your lender.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-xl font-semibold">We could not start your journey</h1>
        <p className="mb-4 max-w-md text-center text-sm text-muted-foreground">
          {error}
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go to homepage
        </button>
      </main>
    );
  }

  return null;
};

export default LenderRedirectClient;
