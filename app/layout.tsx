import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MobileHeader from '@/components/home/mobile-header';
import Footer from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth';
import { AuthProvider } from '@/providers/auth-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { FeatureFlagProvider } from '@/providers/feature-flag-provider';
import { getGlobal } from '@/lib/strapi';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* FeatureFlagProvider must wrap everything for dev tools */}
        <FeatureFlagProvider>
          {/* AuthProvider validates token on mount (PDF Step 1) */}
          <AuthProvider>
            <ToastProvider />
            <MobileHeader
              headerLinks={globalData.headerLinks}
              logo={globalData.logo}
              siteName={globalData.siteName}
            />
            <main className="flex-1">{children}</main>
            <Footer />
            <AuthModal />
          </AuthProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}

