import type { WcStatus } from '@/types/wecredit';
import { cn } from '@/lib/utils';

/**
 * Props for StatusBadge component
 */
interface StatusBadgeProps {
  /** Loan application status */
  status: WcStatus;
  /** Optional additional CSS classes */
  className?: string;
  /** Whether to show icon */
  showIcon?: boolean;
}

/**
 * Status configuration with colors, labels, and CTA text
 */
interface StatusConfigItem {
  label: string;
  bgColor: string;
  textColor: string;
  iconChar: string;
  ctaLabel: string;
}

const STATUS_CONFIG: Record<WcStatus, StatusConfigItem> = {
  INITIATED: {
    label: 'NEW',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    iconChar: '★',
    ctaLabel: 'Apply Now',
  },
  JOURNEY_STARTED: {
    label: 'IN PROGRESS',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600',
    iconChar: '→',
    ctaLabel: 'Continue Application',
  },
  UNDER_REVIEW: {
    label: 'UNDER REVIEW',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    iconChar: '⏳',
    ctaLabel: 'Check Status',
  },
  PENDING: {
    label: 'PENDING',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    iconChar: '⏱',
    ctaLabel: 'Check Status',
  },
  APPROVED: {
    label: 'APPROVED',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    iconChar: '✓',
    ctaLabel: 'Complete Setup',
  },
  REJECTED: {
    label: 'REJECTED',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
    iconChar: '✕',
    ctaLabel: 'View Details',
  },
  DISBURSED: {
    label: 'DISBURSED',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    iconChar: '💰',
    ctaLabel: 'View Details',
  },
  COMPLETED: {
    label: 'COMPLETED',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    iconChar: '✔',
    ctaLabel: 'View Details',
  },
  CANCELLED: {
    label: 'CANCELLED',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500',
    iconChar: '⊘',
    ctaLabel: 'View Details',
  },
  UTM_CLICKED: {
    label: 'UTM CLICKED',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    iconChar: '!',
    ctaLabel: 'View Details',
  },
};

/**
 * StatusBadge Component
 * 
 * Displays a color-coded badge for loan application status
 * Vertical layout with circular icon and label text below
 * 
 * @example
 * ```tsx
 * <StatusBadge status="APPROVED" />
 * <StatusBadge status="UTM_CLICKED" showIcon />
 * ```
 */
export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {showIcon && (
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            config.bgColor
          )}
        >
          <span className={cn('text-sm font-semibold', config.textColor)}>
            {config.iconChar}
          </span>
        </div>
      )}
      <span
        className={cn(
          'text-[10px] font-semibold',
          config.textColor,
          showIcon && 'mt-1'
        )}
      >
        {config.label}
      </span>
    </div>
  );
}

/**
 * Helper function to get status configuration
 * Useful for custom status displays
 */
export function getStatusConfig(status: WcStatus): StatusConfigItem | undefined {
  return STATUS_CONFIG[status];
}

/**
 * Helper function to get CTA label for a status
 */
export function getStatusCtaLabel(status: WcStatus): string {
  return STATUS_CONFIG[status]?.ctaLabel || 'View Details';
}
