'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { NavigationLink } from '@/types/navigation';
import { cn } from '@/lib/utils';

/** Shared card styling for hover dropdowns — blue top border, white rounded card, soft shadow. */
export const DROPDOWN_CARD_CLASS =
  'overflow-hidden rounded-b-2xl rounded-t-lg border-t-[3px] border-wc-blue-500 bg-white shadow-[0_20px_45px_-15px_rgba(16,42,100,0.28)]';

/** Wrapper that toggles the panel on hover/focus, with a top padding acting as a hover bridge. */
export const DROPDOWN_PANEL_CLASS =
  'invisible pointer-events-none absolute top-full z-50 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100';

/** Shared item styling for dropdown links/buttons. */
export const DROPDOWN_ITEM_CLASS =
  'block w-full whitespace-nowrap px-5 py-2.5 text-left text-[15px] font-medium text-gray-700 transition-colors hover:bg-wc-blue-50 hover:text-wc-blue-600';

interface NavDropdownProps {
  link: NavigationLink;
}

/**
 * Desktop navbar item with a hover dropdown of child links (e.g. Loans, Tools).
 */
export const NavDropdown = ({ link }: NavDropdownProps) => {
  const pathname = usePathname();
  const isActive = link.children.some((child) =>
    pathname.startsWith(child.url.replace(/\/$/, ''))
  );

  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={cn(
          'flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors duration-200',
          isActive ? 'text-wc-blue-600' : 'text-gray-700 group-hover:text-wc-blue-600'
        )}
      >
        {link.label}
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      <div className={cn(DROPDOWN_PANEL_CLASS, 'left-1/2 -translate-x-1/2 group-hover:-translate-x-1/2')}>
        <ul className={cn(DROPDOWN_CARD_CLASS, 'min-w-[240px] py-2')}>
          {link.children.map((child) => (
            <li key={child.id}>
              <Link
                href={child.url}
                target={child.openInNewTab ? '_blank' : undefined}
                rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                className={DROPDOWN_ITEM_CLASS}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
