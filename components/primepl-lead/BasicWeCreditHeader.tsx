'use client';

import { IMAGES } from "@/lib/constants/images";
import Image from "next/image";

/**
 * Primepl lead-only header: logo bar (no back control). Pass a real asset URL when ready.
 */
export interface BasicWeCreditHeaderProps {
  className?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export const BasicWeCreditHeader = ({
  className = '',
  logoAlt = 'WeCredit',
  logoWidth = 114,
  logoHeight = 26,
}: BasicWeCreditHeaderProps): React.ReactNode => {
  return (
    <header
      role="banner"
      className={`relative h-14 w-full shrink-0 overflow-hidden bg-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.10)] ${className}`}
    >
      <div className="absolute left-4 top-[14px] h-6 w-28">
        {/* Arbitrary logo URLs (placeholder or partner CDN); next/image needs each host in next.config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={IMAGES.LOGOS.TRANSPARENT}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="block h-6 w-28 object-contain"
          priority
        />
      </div>
    </header>
  );
};
