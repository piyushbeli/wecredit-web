import React from 'react';
import { normalizeHexColor } from '@/lib/utils/colors';

/** Props for ArrowBadge component */
interface ArrowBadgeProps {
  /** Badge text content */
  text: string;
  /** Optional background color */
  backgroundColor?: string | null;
  /** Optional custom class names */
  className?: string;
}

/**
 * Arrow-styled ribbon badge component
 * Displays text with an arrow/ribbon shape pointing inward (right)
 */
const ArrowBadge = ({ text, backgroundColor, className = '' }: ArrowBadgeProps): React.ReactNode => {
  const normalizedBackgroundColor = normalizeHexColor(backgroundColor);
  const badgeBackground = normalizedBackgroundColor
    ? `linear-gradient(90deg, color-mix(in srgb, ${normalizedBackgroundColor} 55%, white) 0%, color-mix(in srgb, ${normalizedBackgroundColor} 75%, white) 40%, ${normalizedBackgroundColor} 100%)`
    : 'linear-gradient(90deg, #A8C8F0 0%, #5B9CF0 40%, #3B82F6 100%)';

  return (
    <div
      className={`relative text-white text-[10px] font-medium pl-4 pr-2 py-0.5 ${className}`}
      style={{
        background: badgeBackground,
        clipPath: 'polygon(0% 0%, 10px 50%, 0% 100%, 100% 100%, 100% 0%)',
      }}
    >
      {text}
    </div>
  );
};

export default ArrowBadge;

