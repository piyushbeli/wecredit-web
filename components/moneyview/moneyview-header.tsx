'use client';

/**
 * MoneyView Header Component
 * Displays MoneyView x WeCredit co-branding with logos
 */

import Image from 'next/image';
import { IMAGES } from '@/lib/constants/images';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface MoneyViewHeaderProps {
  className?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MONEYVIEW_LOGO = `${IMAGES.PARTNERS.BASE_PATH}/moneyview.png`;

const MoneyViewHeader = ({ className, showBackButton = false, onBackClick }: MoneyViewHeaderProps) => {
  return (
    <header className={`bg-white shadow-sm px-4 py-3 ${className || ''}`}>
      <div className="relative flex items-center justify-start gap-3 md:justify-center">
        {showBackButton && (
          <button
            type="button"
            onClick={onBackClick}
            className="shrink-0 p-1 text-gray-700 hover:text-gray-900 md:absolute md:left-0"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}

        <div className="flex items-center justify-center gap-3">
          {/* MoneyView Logo */}
          <Image
            src={MONEYVIEW_LOGO}
            alt="MoneyView"
            width={122}
            height={29}
            className="h-7 w-auto"
            unoptimized
          />

          {/* X separator */}
          <Image
            src={IMAGES.LOGOS.X_ICON}
            alt="X"
            width={20}
            height={20}
            className="h-5 w-auto"
          />

          {/* WeCredit Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={IMAGES.LOGOS.TRANSPARENT}
              alt="WeCredit"
              width={80}
              height={18}
              className="h-4 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MoneyViewHeader;
