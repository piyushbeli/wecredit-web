import type { Metadata, Viewport } from 'next';
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
import Script from 'next/script';

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

/**
 * Metadata
 */
export const metadata: Metadata = {
  title: 'WeCredit - Quick Personal Loans',
  description:
    'Get instant access to personal loans with WeCredit. Quick approval, minimal documentation, and competitive rates.',
};

/**
 * Viewport (moved out of metadata)
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TMJBLB7R');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${poppins.className} antialiased min-h-screen flex flex-col`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TMJBLB7R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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