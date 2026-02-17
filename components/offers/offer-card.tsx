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
    intRate,
    tenure,
    logo,
    wcStatus,
    uptoAmount
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
   * - Explore variant with INITIATED: shows 'Apply Now'
   * - Explore variant with non-INITIATED: shows 'Go to Status'
   */
  const getCtaLabel = (): string => {
    if (variant === 'status') {
      return 'View Details';
    }
    // For explore variant, show 'Apply Now' for INITIATED status
    // All other statuses show 'Go to Status'
    if (wcStatus === 'INITIATED') {
      return 'Apply Now';
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
      className="relative rounded-lg overflow-hidden bg-white"
    >
      {/* Gradient content area */}
<div
  className="pb-2.5"
  style={{
    background: 'linear-gradient(96.83deg, #CCDFFC 35.72%, #FAFCFF 100%)',
  }}
>
  <div className="flex justify-between gap-[10px]">

    {/* Column 1 */}
    <div className="flex flex-col">

      {/* Logo */}
      <div className="mt-[8px] ml-[12px] w-[80px] h-[30px] flex items-center overflow-hidden">
        {logo ? (
          <Image
            src={logo}
            alt={lenderName}
            width={80}
            height={30}
            className="max-h-[30px] w-auto object-contain"
            priority
          />
        ) : (
          <span className="font-medium text-sm text-gray-700 truncate w-full">
            {lenderName}
          </span>
        )}
      </div>

      {/* 8px space */}
      <div className="h-[8px]" />

      {/* Amount */}
      <h3
        className="ml-[12px]"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          lineHeight: '120%',
        }}
      >
        Amount upto {uptoAmount || 0}
      </h3>

      {/* 8px space */}
      <div className="h-[8px]" />

      {/* Rate & Tenure */}
      <div className="ml-[12px] flex items-center gap-6 text-xs text-gray-600">
        {intRate !== undefined && intRate !== null && intRate !== '' && (

          <div className="flex items-center gap-1.5">
            <PercentIcon />
            <span className="font-light leading-none">
              Int. rate {intRate}%
            </span>
          </div>
        )}

              <div className="flex items-center gap-1.5">
                <CalendarIcon />
                <span className="font-light leading-none">
                  Upto {Number(tenure) || 0} m
                </span>
              </div>

      </div>
    </div>

    {/* Column 2 */}
    <div className="flex flex-col items-end mt-[5px] mr-[5px]">
      {shouldShowApprovalBadge && (
        <ApprovalBadge percentage={approvalChance} size="sm" />
      )}

            {shouldShowStatusBadge && (
              <div className="pt-[5px] pr-[5px]">
                <StatusBadge status={wcStatus} />
              </div>
            )}

    </div>

  </div>
</div>


      {/* CTA Section */}
      < div className="py-2 px-3 bg-[#ECF1FE]">
        <ActionButton
          type="button"
          onClick={onClick}
          fullWidth
          className={cn(
            "text-xs font-medium rounded-full py-1 h-[26px]",
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
