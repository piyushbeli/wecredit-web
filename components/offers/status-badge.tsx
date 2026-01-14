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
 * Status configuration with colors and labels
 */
const STATUS_CONFIG: Record<WcStatus, {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon?: string;
}> = {
  INITIATED: {
    label: 'Ready to Apply',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: '🚀',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    icon: '⏳',
  },
  PENDING: {
    label: 'Pending',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: '⏱️',
  },
  APPROVED: {
    label: 'Approved',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: '✅',
  },
  REJECTED: {
    label: 'Rejected',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: '❌',
  },
  DISBURSED: {
    label: 'Disbursed',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: '💰',
  },
  COMPLETED: {
    label: 'Completed',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: '✔️',
  },
  CANCELLED: {
    label: 'Cancelled',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    icon: '🚫',
  },
};

/**
 * StatusBadge Component
 * 
 * Displays a color-coded badge for loan application status
 * 
 * @example
 * ```tsx
 * <StatusBadge status="APPROVED" />
 * <StatusBadge status="UNDER_REVIEW" showIcon />
 * ```
 */
export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {showIcon && config.icon && <span className="text-sm">{config.icon}</span>}
      {config.label}
    </span>
  );
}

/**
 * Helper function to get status configuration
 * Useful for custom status displays
 */
export function getStatusConfig(status: WcStatus) {
  return STATUS_CONFIG[status];
}
