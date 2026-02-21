import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';
import ConditionalMobileHeader from '@/components/layout/conditional-mobile-header';
import ConditionalFooter from '@/components/layout/conditional-footer';
import { AuthModal } from '@/components/auth';
import { AuthProvider } from '@/providers/auth-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { FeatureFlagProvider } from '@/providers/feature-flag-provider';
import { LoadingScreen } from '@/components/shared/loading-screen';
import { getGlobal } from '@/lib/strapi';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  title: 'WeCredit - Quick Personal Loans',
  description: 'Get instant access to personal loans with WeCredit. Quick approval, minimal documentation, and competitive rates.',
};

/**
 * Root layout component that fetches global data from Strapi
 * 
 * Auth Flow (PDF Step 1):
 * AuthProvider validates existing token on app mount
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalData = await getGlobal();

  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${poppins.className} antialiased min-h-screen flex flex-col`}
      >
        {/* FeatureFlagProvider must wrap everything for dev tools */}
        <FeatureFlagProvider>
          {/* AuthProvider validates token on mount (PDF Step 1) */}
          <Suspense fallback={null}>
            <AuthProvider>
              <ToastProvider />
              <ConditionalMobileHeader
                headerLinks={globalData.headerLinks}
                logo={globalData.logo}
                siteName={globalData.siteName}
              />
              <main className="flex-1">{children}</main>
              <ConditionalFooter />
              <AuthModal />
              <LoadingScreen />
            </AuthProvider>
          </Suspense>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}

