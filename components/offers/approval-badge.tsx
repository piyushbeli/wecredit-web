/**
 * ApprovalBadge Component
 * 
 * Displays a circular progress indicator showing approval percentage
 * Used in offer cards to indicate chances of loan approval
 */

interface ApprovalBadgeProps {
  /** Approval percentage (0-100) */
  percentage: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Get size-specific dimensions
 */
const getSizeConfig = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return { diameter: 80, strokeWidth: 3.5, fontSize: 'text-sm', labelSize: 'text-[8px]' };
    case 'lg':
      return { diameter: 100, strokeWidth: 6, fontSize: 'text-2xl', labelSize: 'text-xs' };
    case 'md':
    default:
      return { diameter: 80, strokeWidth: 3.5, fontSize: 'text-lg', labelSize: 'text-[10px]' };
  }
};

/**
 * Circular approval percentage badge
 */
export const ApprovalBadge = ({ percentage, size = 'md' }: ApprovalBadgeProps) => {
  const config = getSizeConfig(size);

  const outerRadius = (config.diameter - config.strokeWidth) / 2;
  const progressRadius = outerRadius - 2;

  const circumference = 2 * Math.PI * progressRadius;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = `approvalGradient-${size}`;

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: config.diameter,
          height: config.diameter,
          background: '#fff',
        }}
      >
        <svg
          className="absolute inset-0 transform -rotate-90"
          width={config.diameter}
          height={config.diameter}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="4.3%" stopColor="#CBDFFC" />
              <stop offset="99.59%" stopColor="#076FDA" />
            </linearGradient>
          </defs>

          {/* Gradient progress Circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={progressRadius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1.5">
          <span
            className="text-[#076FDA]"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '-0.03em',
            }}
          >
            {percentage}%
          </span>

          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 300,
              fontSize: '8px',
              lineHeight: '8px',
              letterSpacing: '0px',
              color: '#4B5563',
            }}
          >
            Chances of<br />Approval
          </span>
        </div>
      </div>
    </div>
  );
};
