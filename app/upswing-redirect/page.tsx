 'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { forwardUpswingRedirect } from '@/lib/api/wecredit';
import { toast } from 'sonner';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import { getCookie } from 'cookies-next';

const isValidMobile = (mobile: string | null): mobile is string => {
  if (!mobile) return false;
  const trimmed = mobile.trim();
  return /^\d{10}$/.test(trimmed);
};

const UpswingRedirectPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mobileParam = searchParams.get('mobile');

    // Guard against missing or invalid mobile values before hitting the API
    if (!isValidMobile(mobileParam)) {
      const message = 'A valid 10-digit mobile number is required to continue.';
      setError(message);
      setIsLoading(false);
      toast.error(message);
      return;
    }

    const runRedirect = async () => {
      try {
        const token: string | undefined = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;

        // forwardUpswingRedirect handles the HTML response and navigation internally
        const result = await forwardUpswingRedirect(mobileParam, token);

        if (!result.success) {
          const message = result.error || 'Unable to start Upswing journey. Please try again.';
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
  }, [searchParams]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-xl font-semibold">Redirecting you to your offer...</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we securely connect you to the Upswing page.
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

export default UpswingRedirectPage;

