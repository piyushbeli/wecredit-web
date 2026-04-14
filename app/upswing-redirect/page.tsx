'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { forwardUpswingRedirect } from '@/lib/api/wecredit';
import { toast } from 'sonner';
import { STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';
import { getCookie } from 'cookies-next';
import { useAuthStore } from '@/stores/auth-store';
import { isValidMobile } from '@/lib/utils/common-helper';
import { buildPathWithQuery } from '@/lib/utils/path-with-query';

const UpswingRedirectPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthInitialized, isAuthenticated, openModalWithPendingActionAtOtp } = useAuthStore();
  const hasAutoOpenedAuthModal = useRef(false);
  const lastMobileParam = useRef<string | null>(null);

  useEffect(() => {
    const mobileParam = searchParams.get('mn');

    if (lastMobileParam.current !== mobileParam) {
      hasAutoOpenedAuthModal.current = false;
      lastMobileParam.current = mobileParam;
    }

    if (!isAuthInitialized) {
      return;
    }

    if (!isValidMobile(mobileParam)) {
      const message =
        'A valid 10-digit mobile number starting with 6–9 is required to continue.';
      setError(message);
      setIsLoading(false);
      toast.error(message);
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      const returnHref = buildPathWithQuery(pathname, searchParams.toString());
      if (!hasAutoOpenedAuthModal.current) {
        hasAutoOpenedAuthModal.current = true;
        openModalWithPendingActionAtOtp(
          {
            type: 'navigate_to_offer',
            href: returnHref,
          },
          mobileParam
        );
      }
      return;
    }

    setIsLoading(true);

    const runRedirect = async () => {
      try {
        const token: string | undefined = getCookie(STORAGE_AUTH_TOKEN) as string | undefined;

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
  }, [isAuthInitialized, isAuthenticated, pathname, searchParams, openModalWithPendingActionAtOtp]);

  const mobileParam = searchParams.get('mn');
  const hasValidMobile = isValidMobile(mobileParam);

  const handleOpenSignIn = (): void => {
    const returnHref = buildPathWithQuery(pathname, searchParams.toString());
    if (!isValidMobile(mobileParam)) {
      return;
    }
    openModalWithPendingActionAtOtp(
      {
        type: 'navigate_to_offer',
        href: returnHref,
      },
      mobileParam
    );
  };

  if (!isAuthInitialized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-xl font-semibold">Checking your session...</h1>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </main>
    );
  }

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

  if (hasValidMobile && !isAuthenticated && !error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-xl font-semibold">Sign in to continue</h1>
        <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
          You need to be signed in with OTP to open your Upswing offer. Use the sign-in screen if it
          is not visible, or tap below to open it again.
        </p>
        <button
          type="button"
          onClick={handleOpenSignIn}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Sign in with OTP
        </button>
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
