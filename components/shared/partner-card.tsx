'use client';

import { useState, JSX } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { PartnerDetail } from '@/lib/constants/partners-data';

interface PartnerCardProps {
  /** Partner information to display */
  partner: PartnerDetail;
}

/**
 * Renders a detail row with label and value
 * Used for displaying partner information in a consistent format
 * Includes white border separator at the top to create table-like appearance
 */
const DetailRow = ({ label, value, isLink = false, showBorder = true }: { label: string; value: string; isLink?: boolean; showBorder?: boolean }): JSX.Element => {
  return (
    <div className={`flex h-9 ${showBorder ? 'border-t border-white' : ''}`}>
      <div className="w-40 bg-violet-50 px-3 flex items-center border-r border-white">
        <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-3">{label}</div>
      </div>
      <div className="flex-1 bg-violet-50 px-3 flex items-center">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-800 text-xs font-normal font-['Poppins'] underline leading-3 hover:text-blue-600 transition-colors"
          >
            {value}
          </a>
        ) : (
          <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-3">{value}</div>
        )}
      </div>
    </div>
  );
};

/**
 * Partner card component with expandable details
 * Displays partner logo, company name, phone (always visible)
 * and expandable section for officer, email, and website link
 */
const PartnerCard = ({ partner }: PartnerCardProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (): void => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
      {/* Card Header with gradient background */}
      <div className="w-full h-9 bg-linear-to-r from-blue-200 to-slate-50 overflow-hidden relative flex items-center justify-between px-3">
        {/* Partner Logo */}
        <div className="flex items-center">
          <Image
            src={partner.logo}
            alt={partner.companyName}
            width={43}
            height={21}
            className="object-contain"
            priority={false}
          />
        </div>

        {/* More Info Button */}
        <button
          type="button"
          onClick={toggleExpanded}
          className="h-6 px-2.5 bg-blue-500/20 rounded-3xl inline-flex justify-center items-center gap-2.5 hover:bg-blue-500/30 transition-colors"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} more information about ${partner.companyName}`}
        >
          <span className="text-center text-blue-500 text-xs font-medium font-['Manrope'] leading-4">More Info</span>
          <ChevronRight
            className={`w-1.5 h-3 text-blue-500 transition-transform duration-200 origin-center ${
              isExpanded ? 'rotate-0' : 'rotate-90'
            }`}
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Always Visible Details - Table-like structure with two rows */}
      <div className="w-full">
        <DetailRow label="Company Name" value={partner.companyName} showBorder={true} />
        <DetailRow label="Phone" value={partner.phone} showBorder={true} />
      </div>

      {/* Expandable Details */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="w-full">
          <DetailRow label="Officer" value={partner.officer} />
          <DetailRow label="Email" value={partner.email} />
          <DetailRow label="Link" value={partner.websiteLink} isLink />
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
