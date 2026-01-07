import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - WeCredit',
  description: 'Login or create your WeCredit account',
};

/**
 * Auth layout - clean layout without header/footer for auth pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return <>{children}</>;
}

