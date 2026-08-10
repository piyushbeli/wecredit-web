'use client';

import { useState } from 'react';
import type { FocusEvent } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DROPDOWN_CARD_CLASS,
  DROPDOWN_ITEM_CLASS,
  DROPDOWN_PANEL_CLASS,
} from './nav-dropdown';

interface UserMenuDropdownProps {
  phoneNumber?: string;
  logout: () => void;
  className?: string;
}

/**
 * Desktop authenticated user menu — icon trigger with a hover dropdown
 * (profile + logout). Mobile keeps the slide-out drawer instead.
 */
export const UserMenuDropdown = ({ phoneNumber, logout, className }: UserMenuDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={cn('group relative', className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Open user menu${phoneNumber ? ` for +91 ${phoneNumber}` : ''}`}
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-wc-blue-100 p-2.5 text-sm font-medium text-wc-blue-600 transition-all duration-300 hover:bg-wc-blue-200"
      >
        <User className="h-5 w-5" />
      </button>

      <div
        className={cn(
          DROPDOWN_PANEL_CLASS,
          'right-0 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100'
        )}
      >
        <div className={cn(DROPDOWN_CARD_CLASS, 'min-w-[220px] py-2')}>
          {phoneNumber ? (
            <p className="px-5 pb-2 pt-1 text-xs text-gray-400">+91 {phoneNumber}</p>
          ) : null}

          <Link href="/offers" className={DROPDOWN_ITEM_CLASS}>
            My profile
          </Link>

          <button type="button" onClick={logout} className={cn(DROPDOWN_ITEM_CLASS, 'flex items-center gap-2')}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
