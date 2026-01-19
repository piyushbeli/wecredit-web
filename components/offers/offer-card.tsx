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
import { ActionButton } from '../shared';

type OfferCardVariant = 'default' | 'utmClicked';

interface OfferCardProps {
  /** Lender offer data */
  offer: LenderOfferStatus;
  /** Click handler for the View Details button */
  onClick?: () => void;
  /** Offer card style variant */
  variant?: OfferCardVariant;
}

/**
 * Offer card component with approval chances badge
 * Matches trending card structure but shows approval percentage
 */
export function OfferCard({ offer, onClick, variant }: OfferCardProps) {
  const {
    lenderName,
    loanAmount,
    interestRate,
    tenure,
    logo,
    wcStatus
  } = offer;
  const resolvedVariant: OfferCardVariant = variant ?? 'default';
  const isUtmClicked: boolean = wcStatus === 'UTM_CLICKED';
  const approvalChance: number = offer.approvalRate || 70;
  const ctaLabel: string = isUtmClicked ? 'View Details' : 'Apply Now';
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
        {/* Approval Badge - Circular percentage at top right corner */}
        {!isUtmClicked && (
          <div className="absolute right-2 top-2">
            <ApprovalBadge percentage={approvalChance} size="sm" />
          </div>
        )}
        {isUtmClicked && (
          <div className="absolute right-3 top-3 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
              <span className="text-orange-600 text-sm font-semibold">!</span>
            </div>
            <span className="mt-1 text-[10px] font-semibold text-orange-600 tracking-wide">
              UTM CLICKED
            </span>
          </div>
        )}

        {/* {JSON.stringify({wcStatus})} */}

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
          className="text-xs font-medium rounded-full py-1 h-6"
        >
          {ctaLabel}
        </ActionButton>
      </div>
    </div>
  );
}
