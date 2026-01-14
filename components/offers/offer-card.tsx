import type { LenderOfferStatus } from '@/types/wecredit';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

/**
 * Props for OfferCard component
 */
interface OfferCardProps {
  /** Lender offer data */
  offer: LenderOfferStatus;
  /** Click handler for the card/CTA */
  onClick?: () => void;
}

/**
 * Get CTA text based on offer status
 */
function getCtaText(status: string): string {
  switch (status) {
    case 'INITIATED':
      return 'Continue Application';
    case 'APPROVED':
      return 'View Offer Details';
    case 'REJECTED':
      return 'Try Other Lenders';
    case 'UNDER_REVIEW':
    case 'PENDING':
      return 'Check Status';
    case 'DISBURSED':
      return 'View Details';
    case 'COMPLETED':
      return 'View History';
    default:
      return 'View Details';
  }
}

/**
 * OfferCard Component
 * 
 * Displays an individual lender offer with status, details, and CTA
 * 
 * Features:
 * - Gradient background support
 * - Lender logo display
 * - Status badge
 * - Loan details (amount, rate, tenure, EMI)
 * - Context-aware CTA button
 * 
 * @example
 * ```tsx
 * <OfferCard 
 *   offer={offerData} 
 *   onClick={() => handleOfferClick(offerData)}
 * />
 * ```
 */
export function OfferCard({ offer, onClick }: OfferCardProps) {
  const {
    lenderName,
    wcStatus,
    loanAmount,
    interestRate,
    tenure,
    emi,
    logo,
    gradient,
    title,
    subtitle,
    statusMessage,
  } = offer;

  // Use gradient if available, otherwise default blue gradient
  const backgroundStyle = gradient
    ? { background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }
    : { background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with gradient background */}
      <div
        className="relative h-32 p-4 flex items-center justify-between"
        style={backgroundStyle}
      >
        {/* Lender Info */}
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">
            {title || lenderName}
          </h3>
          {subtitle && (
            <p className="text-white/90 text-sm">{subtitle}</p>
          )}
          {statusMessage && !subtitle && (
            <p className="text-white/80 text-xs mt-1">{statusMessage}</p>
          )}
        </div>

        {/* Logo */}
        {logo && (
          <div className="shrink-0 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <img
              src={logo}
              alt={`${lenderName} logo`}
              className="w-12 h-12 object-contain"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Status Badge */}
        <div className="mb-4">
          <StatusBadge status={wcStatus} showIcon />
        </div>

        {/* Loan Details Grid */}
        {(loanAmount || interestRate || tenure || emi) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {loanAmount && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
                <p className="text-base font-bold text-gray-900">₹{loanAmount}</p>
              </div>
            )}
            {interestRate && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
                <p className="text-base font-bold text-gray-900">{interestRate}%</p>
              </div>
            )}
            {tenure && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Tenure</p>
                <p className="text-base font-bold text-gray-900">{tenure} months</p>
              </div>
            )}
            {emi && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Monthly EMI</p>
                <p className="text-base font-bold text-gray-900">₹{emi}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onClick}
          className={cn(
            'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200',
            'active:scale-[0.98]',
            wcStatus === 'INITIATED' &&
              'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30',
            wcStatus === 'APPROVED' &&
              'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/30',
            wcStatus === 'REJECTED' &&
              'bg-gray-600 text-white hover:bg-gray-700',
            (wcStatus === 'UNDER_REVIEW' || wcStatus === 'PENDING') &&
              'bg-yellow-600 text-white hover:bg-yellow-700',
            wcStatus === 'DISBURSED' &&
              'bg-purple-600 text-white hover:bg-purple-700',
            (wcStatus === 'COMPLETED' || wcStatus === 'CANCELLED') &&
              'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {getCtaText(wcStatus)}
        </button>
      </div>
    </div>
  );
}
