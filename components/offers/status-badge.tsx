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
  NOT_PROCESSED: {
    label: 'NOT PROCESSED',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-600',
    iconChar: '○',
    ctaLabel: 'Check Status',
  },
  INITIATED: {
    label: 'INITIATED',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    iconChar: '★',
    ctaLabel: 'Apply Now',
  },
  ELIGIBILITY_REJECTED: {
    label: 'ELIGIBILITY REJECTED',
    bgColor: 'bg-red-200',
    textColor: 'text-red-500',
    iconChar: '✕',
    ctaLabel: 'View Details',
  },
  UTM_CLICKED: {
    label: 'UTM CLICKED',
    bgColor: "bg-[#B878FF]/20",
    textColor: 'text-purple-500',
    iconChar: '!',
    ctaLabel: 'Go to Status',
  },
  JOURNEY_STARTED: {
    label: 'JOURNEY STARTED',
    bgColor: 'bg-purple-200',
    textColor: 'text-purple-500',
    iconChar: '→',
    ctaLabel: 'Continue Application',
  },
  UNDER_REVIEW: {
    label: 'UNDER REVIEW',
    bgColor: 'bg-orange-200',
    textColor: 'text-orange-500',
    iconChar: '⏳',
    ctaLabel: 'Check Status',
  },
  PENDING: {
    label: 'PENDING',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-500',
    iconChar: '⏱',
    ctaLabel: 'Check Status',
  },
  APPROVED: {
    label: 'APPROVED',
    bgColor: 'bg-green-200',
    textColor: 'text-green-500',
    iconChar: '✓',
    ctaLabel: 'Complete Setup',
  },
  REJECTED: {
    label: 'REJECTED',
    bgColor: 'bg-red-200',
    textColor: 'text-red-500',
    iconChar: '✕',
    ctaLabel: 'View Details',
  },
  DISBURSED: {
    label: 'DISBURSED',
    bgColor: "bg-[#0048FF33]",
    textColor: 'text-blue-500',
    iconChar: '💰',
    ctaLabel: 'View Details',
  },
  COMPLETED: {
    label: 'COMPLETED',
      bgColor: 'bg-green-200',
    textColor: 'text-green-500',
    iconChar: '✔',
    ctaLabel: 'View Details',
  },
  CANCELLED: {
    label: 'CANCELLED',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-500',
    iconChar: '⊘',
    ctaLabel: 'View Details',
  },
};

/**
 * StatusBadge Component
 * 
 * Displays a color-coded pill-shaped badge for loan application status
 * Horizontal layout with rounded corners (pill shape)
 * 
 * @example
 * ```tsx
 * <StatusBadge status="APPROVED" />
 * <StatusBadge status="UTM_CLICKED" />
 * ```
 */
export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 rounded-full',
        config.bgColor,
        config.textColor,
        'text-[12px] font-medium leading-[140%] tracking-[0] text-center font-manrope',
        className
      )}
    >
      <span>{config.label}</span>
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
