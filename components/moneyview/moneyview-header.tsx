'use client';

/**
 * MoneyView Header Component
 * Displays MoneyView x WeCredit co-branding with logos
 */

import Image from 'next/image';
import { IMAGES } from '@/lib/constants/images';
import Link from 'next/link';

interface MoneyViewHeaderProps {
  className?: string;
}

const MONEYVIEW_LOGO = `${IMAGES.PARTNERS.BASE_PATH}/moneyview.png`;

const MoneyViewHeader = ({ className }: MoneyViewHeaderProps) => {
  return (
    <header className={`bg-white shadow-sm px-4 py-3 ${className || ''}`}>
      <div className="flex items-center sm:justify-center justify-start gap-3">
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
    </header>
  );
};

export default MoneyViewHeader;
