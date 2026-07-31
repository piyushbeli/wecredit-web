import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Redirect/interstitial page — keep it out of the index (server layout carries
// metadata since the page itself is a client component).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function UpswingRedirectLayout({ children }: { children: ReactNode }) {
  return children;
}
