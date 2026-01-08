import React from 'react';

/** Props for ArrowBadge component */
interface ArrowBadgeProps {
  /** Badge text content */
  text: string;
  /** Optional custom class names */
  className?: string;
}

/**
 * Arrow-styled ribbon badge component
 * Displays text with an arrow/ribbon shape pointing inward (right)
 */
const ArrowBadge = ({ text, className = '' }: ArrowBadgeProps): React.ReactNode => {
  return (
    <div
      className={`relative text-white text-xs font-medium pl-4 pr-2 py-0.5 ${className}`}
      style={{
        background: 'linear-gradient(90deg, #A8C8F0 0%, #5B9CF0 40%, #3B82F6 100%)',
        clipPath: 'polygon(0% 0%, 10px 50%, 0% 100%, 100% 100%, 100% 0%)',
      }}
    >
      {text}
    </div>
  );
};

export default ArrowBadge;

