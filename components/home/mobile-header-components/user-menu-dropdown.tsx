'use client';

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
  return (
    <div className={cn('group relative', className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-label={`Open user menu${phoneNumber ? ` for +91 ${phoneNumber}` : ''}`}
        className="flex cursor-pointer items-center gap-1.5 rounded-md bg-wc-blue-100 p-2.5 text-sm font-medium text-wc-blue-600 transition-all duration-300 hover:bg-wc-blue-200"
      >
        <User className="h-5 w-5" />
      </button>

      <div className={cn(DROPDOWN_PANEL_CLASS, 'right-0')}>
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
