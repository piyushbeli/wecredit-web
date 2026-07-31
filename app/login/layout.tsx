import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Auth page — keep it out of the index (server layout carries metadata since
// the login page itself is a client component).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
