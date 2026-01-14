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
      return { diameter: 60, strokeWidth: 4, fontSize: 'text-sm', labelSize: 'text-[8px]' };
    case 'lg':
      return { diameter: 100, strokeWidth: 6, fontSize: 'text-2xl', labelSize: 'text-xs' };
    case 'md':
    default:
      return { diameter: 80, strokeWidth: 5, fontSize: 'text-lg', labelSize: 'text-[10px]' };
  }
};

/**
 * Circular approval percentage badge
 */
export const ApprovalBadge = ({ percentage, size = 'md' }: ApprovalBadgeProps) => {
  const config = getSizeConfig(size);
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          className="transform -rotate-90"
          width={config.diameter}
          height={config.diameter}
        >
          {/* Background circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="white"
            stroke="#E5E7EB"
            strokeWidth={config.strokeWidth}
          />
          
          {/* Progress circle */}
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-blue-600 ${config.fontSize}`}>
            {percentage}%
          </span>
          <span className={`text-gray-600 text-center leading-tight ${config.labelSize}`}>
            Chances of<br />Approval
          </span>
        </div>
      </div>
    </div>
  );
};
