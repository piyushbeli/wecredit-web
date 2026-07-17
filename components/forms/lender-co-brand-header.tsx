'use client';

import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { IMAGES } from '@/lib/constants/images';
import { cn } from '@/lib/utils';

export interface LenderBranding {
  displayName?: string | null;
  logo?: string | null;
  imageUrl?: string | null;
  topColour?: string | null;
  backColour?: string | null;
}

interface LenderCoBrandHeaderProps {
  lenderName?: string;
  branding?: LenderBranding | null;
  isAllLenders?: boolean;
  className?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const getLogoSrc = (branding?: LenderBranding | null): string | null => {
  return branding?.logo || branding?.imageUrl || null;
};

const LenderCoBrandHeader = ({
  lenderName,
  branding,
  isAllLenders = false,
  className,
  showBackButton = false,
  onBackClick,
}: LenderCoBrandHeaderProps) => {
  if (isAllLenders) return null;

  const logoSrc = getLogoSrc(branding);
  const displayName = branding?.displayName || lenderName || 'Lender';
  const accentColor = branding?.topColour || branding?.backColour || undefined;


  const lenderLogo = logoSrc ? (
    <Image
      src={logoSrc}
      alt={`${displayName} logo`}
      width={132}
      height={40}
      className="max-h-10 w-auto max-w-[132px] object-contain"
      unoptimized
    />
  ) : (
    <span className="max-w-[132px] truncate text-lg font-semibold text-gray-900">
      {displayName}
    </span>
  );

  const crossIcon = (
    <Image
      src={IMAGES.LOGOS.X_ICON}
      alt="X"
      width={24}
      height={24}
      className="h-6 w-auto shrink-0"
    />
  );

  const weCreditLogo = (
    <a
      href="/"
      aria-label="Go to WeCredit home page"
      className="flex shrink-0 items-center"
    >
      <Image
        src={IMAGES.LOGOS.TRANSPARENT}
        alt="WeCredit"
        width={112}
        height={26}
        className="h-6 w-auto"
      />
    </a>
  );


  let backButton: ReactNode;
  if (showBackButton) {
    backButton = (
      <button
        type="button"
        onClick={onBackClick}
        aria-label="Back"
        className="shrink-0 p-1 text-gray-700 hover:text-gray-900 md:absolute md:left-0"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
    );
  }

  return (
    <header
      className={cn('bg-white px-4 py-3 shadow-sm', className)}
      style={accentColor ? { borderBottom: `2px solid ${accentColor}` } : undefined}
    >
      <div className="relative flex min-h-9 items-center justify-start gap-3 md:justify-center">
        {backButton}

        <div className="flex min-w-0 items-center justify-center gap-4">
          {lenderLogo}

          <div className="flex shrink-0 items-center gap-4">
            {crossIcon}
            {weCreditLogo}
          </div>
        </div>
      </div>
      
    </header>
  );
};

export default LenderCoBrandHeader;
