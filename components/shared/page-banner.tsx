import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/** Tailwind color to hex mapping for common colors */
const colorMap: Record<string, string> = {
  'blue-700': '#1d4ed8',
  white: '#ffffff',
  'blue-600': '#2563eb',
  'blue-500': '#3b82f6',
};

/**
 * Converts Tailwind color name to hex value, or returns the value if it's already a hex/rgb
 */
const getColorValue = (color: string): string => {
  // If it's already a hex or rgb value, return as-is
  if (color.startsWith('#') || color.startsWith('rgb')) {
    return color;
  }
  // Look up in color map
  return colorMap[color] || color;
};

/** Props for PageBanner component */
interface PageBannerProps {
  /** The banner text to display (e.g., "PRIVACY POLICY") */
  title: string;
  /** Top gradient color - Tailwind class name (e.g., "blue-700") or hex/rgb value (default: "blue-700") */
  gradientFrom?: string;
  /** Bottom gradient color - Tailwind class name (e.g., "white") or hex/rgb value (default: "white") */
  gradientTo?: string;
  /** Image path for the icon (e.g., "/assets/images/wecredit-heart.png"). If provided, this will be used instead of the CSS-based icon */
  iconImage?: string;
  /** Alt text for the icon image (default: "Icon") */
  iconAlt?: string;
  /** Whether to show the icon (default: true). Ignored if iconImage is provided */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Width class (default fills the available viewport while keeping page gutters) */
  width?: string;
  /** Height/min-height class */
  height?: string;
}

/**
 * Reusable page banner component with gradient background
 * Displays a title with optional icon (image or CSS-based shield+heart)
 * Used for static pages like Privacy Policy, Terms of Service, etc.
 */
const PageBanner = ({
  title,
  gradientFrom = 'blue-700',
  gradientTo = 'white',
  iconImage,
  iconAlt = 'Icon',
  showIcon = true,
  className,
  width = 'w-full',
  height = 'min-h-[150px] sm:min-h-[180px] lg:min-h-[204px]',
}: PageBannerProps): React.ReactNode => {
  // Handle edge case: empty or invalid title
  if (!title || title.trim().length === 0) {
    return null;
  }

  // Use default Tailwind classes for common case, inline styles for custom colors
  const isDefaultGradient = gradientFrom === 'blue-700' && gradientTo === 'white';
  const gradientStyle = isDefaultGradient
    ? undefined
    : {
      backgroundImage: `linear-gradient(to bottom, ${getColorValue(gradientFrom)}, ${getColorValue(gradientTo)})`,
    };

  return (
    <div
      className={cn(
        width,
        height,
        'relative px-4 py-8 sm:px-6',
        isDefaultGradient ? 'bg-[linear-gradient(180deg,_#1562D8_0%,_#8FB9F1_52%,_#FFFFFF_100%)]'
          : '',
        'rounded-xl overflow-hidden flex flex-col items-center justify-start gap-5 sm:gap-6 ',
        className
      )}
      style={gradientStyle}
    >
      {/* Title */}
      <div className="text-center text-white text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
        {title}
      </div>

      {/* Icon */}
      {iconImage ? (
        <Image
          src={iconImage}
          alt={iconAlt}
          width={56}
          height={68}
          className="h-auto w-12 object-contain sm:w-14"
        />
      ) : (
        showIcon && (
          <div className="flex flex-col items-center" aria-hidden="true">
            <div
              className="h-14 w-11 bg-white"
              style={{ clipPath: 'polygon(50% 0, 100% 18%, 100% 48%, 82% 78%, 50% 100%, 18% 78%, 0 48%, 0 18%)' }}
            />
            <div className="-mt-8 h-4 w-4 rounded-full bg-[#1562D8]" />
          </div>
        )
      )}
    </div>
  );
};

export default PageBanner;
