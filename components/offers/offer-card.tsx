/**
 * OfferCard Component
 * 
 * Displays an individual lender offer with approval chances badge
 * White outer container with gradient content area and circular approval badge
 */

import Image from 'next/image';
import type { LenderOfferStatus } from '@/types/wecredit';
import { PercentIcon, CalendarIcon } from '@/components/icons';
import { ApprovalBadge } from './approval-badge';
import { StatusBadge, getStatusCtaLabel } from './status-badge';
import { ActionButton } from '../shared';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  /** Lender offer data */
  offer: LenderOfferStatus;
  /** Click handler for the CTA button */
  onClick?: () => void;
  /** Variant: 'explore' shows ApprovalBadge for INITIATED/UTM_CLICKED, 'status' shows StatusBadge for all */
  variant?: 'explore' | 'status';
}

/**
 * Offer card component with approval chances badge
 * Matches trending card structure but shows approval percentage
 */
export function OfferCard({ offer, onClick, variant = 'explore' }: OfferCardProps) {
  const {
    lenderName,
    loanAmount,
    interestRate,
    tenure,
    logo,
    wcStatus
  } = offer;
  
  // In explore screen: show ApprovalBadge for INITIATED and UTM_CLICKED
  // In explore screen: never show StatusBadge (only show approval percentage)
  // In status screen: show StatusBadge for all statuses (including UTM_CLICKED)
  const shouldShowApprovalBadge: boolean = variant === 'explore';
  const shouldShowStatusBadge: boolean = variant === 'status';
  
  const approvalChance: number = offer.approvalRate || 0;
  
  /**
   * Determines the CTA label based on variant and offer status
   * - Status variant: always shows 'Apply Now'
   * - Explore variant with INITIATED: shows status-specific label (e.g., 'Interested')
   * - Explore variant with non-INITIATED: shows 'Go to Status'
   */
  const getCtaLabel = (): string => {
    if (variant === 'status') {
      return 'Apply Now';
    }
    // For explore variant, show 'Interested' only for INITIATED status
    // All other statuses show 'Go to Status'
    if (wcStatus === 'INITIATED') {
      return getStatusCtaLabel(wcStatus);
    }
    return 'Go to Status';
  };
  
  const ctaLabel: string = getCtaLabel();
  const isClickedOffer: boolean = wcStatus === 'UTM_CLICKED';
  // For explore variant with non-INITIATED status, show green background
  const shouldShowGreenButton: boolean = 
    variant === 'explore' && wcStatus !== 'INITIATED';
  
  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-white border border-gray-200"
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Gradient content area */}
      <div
        className="relative p-3 pb-4"
        style={{
          background: 'linear-gradient(145deg, #D4E4FC 0%, #EEF4FF 50%, #FAFCFF 100%)',
        }}
      >
        {/* Approval Badge - Only shown in explore screen for INITIATED and UTM_CLICKED */}
        {shouldShowApprovalBadge && (
          <div className="absolute right-2 top-2">
            <ApprovalBadge percentage={approvalChance} size="sm" />
          </div>
        )}
        {/* Status Badge - Shown in status screen for all statuses, or in explore for other statuses */}
        {shouldShowStatusBadge && (
          <div className="absolute right-3 top-3">
            <StatusBadge status={wcStatus} />
          </div>
        )}

        {/* Header: Logo */}
        <div className="flex items-center mb-1">
          {logo ? (
            <Image
              src={logo}
              alt={lenderName}
              width={100}
              height={10}
              className="object-contain h-5 w-auto"
              priority
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-wc-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {lenderName.charAt(0)}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {lenderName}
              </span>
            </div>
          )}
        </div>

        {/* Amount */}
        <h3 className="font-medium text-sm mb-1">
          Amount upto {loanAmount}
        </h3>

        {/* Rate & Tenure - With proper icons */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          {interestRate && (
            <div className="flex items-center gap-1">
              <PercentIcon />
              <span className="text-gray-600 text-xs">Int. rate {interestRate}%</span>
            </div>
          )}
          {tenure && (
            <div className="flex items-center gap-1">
              <CalendarIcon />
              <span className="text-gray-600 text-xs">Upto {tenure} m</span>
            </div>
          )}
        </div>
      </div>

      {/* CTA Button - On white background outside gradient */}
      <div className="p-2 bg-white">
        <ActionButton
          type="button"
          onClick={onClick}
          fullWidth
          className={cn(
            "text-xs font-medium rounded-full py-1 h-6",
            (isClickedOffer || shouldShowGreenButton) && "bg-green-600 hover:bg-green-700 text-white",
            variant === 'status' && "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {ctaLabel}
        </ActionButton>
      </div>
    </div>
  );
}
