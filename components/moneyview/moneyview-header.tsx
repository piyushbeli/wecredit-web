'use client';

/**
 * MoneyView Header Component
 * Displays MoneyView x WeCredit co-branding with logos
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { IMAGES } from '@/lib/constants/images';
import { cn } from '@/lib/utils';

interface MoneyViewHeaderProps {
  className?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const MONEYVIEW_LOGO = `${IMAGES.PARTNERS.BASE_PATH}/moneyview.png`;

const MoneyViewHeader = ({
  className,
  showBackButton = false,
  onBackClick,
}: MoneyViewHeaderProps) => {
  const backButton =
    showBackButton && onBackClick ? (
      <button
        type="button"
        onClick={onBackClick}
        className="shrink-0 p-1 text-gray-700 hover:text-gray-900 md:absolute md:left-0"
        aria-label="Back"
      >
        <ArrowLeft className="h-6 w-6" aria-hidden="true" />
      </button>
    ) : null;

  const moneyViewLogo = (
    <Image
      src={MONEYVIEW_LOGO}
      alt="MoneyView"
      width={122}
      height={29}
      className="h-7 w-auto"
      unoptimized
    />
  );

  const crossIcon = (
    <Image
      src={IMAGES.LOGOS.X_ICON}
      alt=""
      width={20}
      height={20}
      className="h-5 w-auto"
      aria-hidden="true"
    />
  );

  const weCreditLogo = (
    <Link
      href="/"
      className="flex items-center"
      aria-label="Go to WeCredit home page"
    >
      <Image
        src={IMAGES.LOGOS.TRANSPARENT}
        alt="WeCredit"
        width={80}
        height={18}
        className="h-4 w-auto"
      />
    </Link>
  );

  return (
    <header className={cn('bg-white px-4 py-3 shadow-sm', className)}>
      <div className="relative flex items-center justify-start gap-3 md:justify-center">
        {backButton}

        <div className="flex items-center justify-center gap-3">
          {moneyViewLogo}
          {crossIcon}
          {weCreditLogo}
        </div>
      </div>
    </header>
  );
};

export default MoneyViewHeader;