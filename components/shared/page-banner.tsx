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
  /** Width class (default: "w-full md:w-96") */
  width?: string;
  /** Height class (default: "h-32") */
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
  width = 'w-full md:w-96',
  height = 'h-32',
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
        'relative',
        isDefaultGradient ? 'bg-linear-to-b from-blue-700 to-white' : '',
        'rounded-2xl',
        'overflow-hidden',
        className
      )}
      style={gradientStyle}
    >
      {/* Title text - centered horizontally */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2 text-center text-white text-xl font-semibold font-['Poppins'] leading-6 whitespace-nowrap">
        {title}
      </div>

      {/* Icon - render image if provided, otherwise render CSS-based shield+heart */}
      {iconImage ? (
        <div className="absolute left-1/2 top-[66px] -translate-x-1/2 flex items-center justify-center">
          <Image
            src={iconImage}
            alt={iconAlt}
            width={32}
            height={40}
            className="object-contain"
          />
        </div>
      ) : (
        showIcon && (
          <>
            {/* Shield outline */}
            <div className="absolute left-1/2 top-[66px] -translate-x-1/2 w-8 h-10 bg-white outline outline-[1.50px] outline-offset-[-0.75px] outline-white" />
            {/* Heart inside shield */}
            <div className="absolute left-1/2 top-[78.08px] -translate-x-1/2 size-3.5 bg-blue-700 outline outline-[0.72px] outline-offset-[-0.36px] outline-white" />
          </>
        )
      )}
    </div>
  );
};

export default PageBanner;
