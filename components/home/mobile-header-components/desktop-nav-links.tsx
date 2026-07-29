'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationLink } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { NavDropdown } from './nav-dropdown';

interface DesktopNavLinksProps {
  headerLinks: NavigationLink[];
}

export const DesktopNavLinks = ({ headerLinks }: DesktopNavLinksProps) => {
  const pathname = usePathname();

  const isActive = (url: string): boolean => {
    if (url === '/') return pathname === '/';
    return pathname.startsWith(url.replace(/\/$/, ''));
  };

  const renderLink = (link: NavigationLink) => {
    if (link.children && link.children.length > 0) {
      return <NavDropdown key={link.id} link={link} />;
    }

    return (
      <Link
        key={link.id}
        href={link.url}
        target={link.openInNewTab ? '_blank' : undefined}
        rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
        className={cn(
          'text-sm font-medium transition-colors duration-200',
          isActive(link.url) ? 'text-wc-blue-600' : 'text-gray-700 hover:text-wc-blue-600'
        )}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <nav className="hidden lg:flex items-center justify-center gap-8" aria-label="Main navigation">
      {headerLinks.map(renderLink)}
    </nav>
  );
};
