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
 */
const DetailRow = ({
  label,
  value,
  isLink = false,
  showBorder = true,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  showBorder?: boolean;
}): JSX.Element => {
  return (
    <div className={`flex items-stretch ${showBorder ? 'border-t border-white' : ''}`}>

      {/* Left Column */}
      <div className="w-40 bg-[#F3F6FF] border-r border-white flex items-center px-3 py-[13px]">
        <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-4">
          {label}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 bg-[#F3F6FF] flex items-center px-3 py-[5px]">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-800 text-xs font-normal font-['Poppins'] underline leading-4 hover:text-blue-600 transition-colors"
          >
            {value}
          </a>
        ) : (
          <div className="text-zinc-800 text-xs font-normal font-['Poppins'] leading-4">
            {value}
          </div>
        )}
      </div>
    </div>
  );
};


/**
 * Partner card component with expandable details
 */
const PartnerCard = ({ partner }: PartnerCardProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = (): void => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden bg-white">
      {/* Card Header */}
      <div className="w-full h-9 bg-[linear-gradient(96.83deg,_#CCDFFC_35.72%,_#FAFCFF_100%)] flex items-center justify-between pl-3 pr-2">
        {/* Partner Logo */}
        <div className="h-6 flex items-center shrink-0">
          <Image
            src={partner.logo}
            alt={partner.companyName}
            width={80}
            height={24}
            unoptimized
            className="h-6 w-auto max-w-[80px] object-contain"
            priority={false}
          />
        </div>


        {/* More Info Button */}
        <button
          type="button"
          onClick={toggleExpanded}
          className="h-6 bg-[#4080FF33] rounded-3xl inline-flex justify-center items-center  pl-3 pr-1 hover:bg-[#4080FF55] transition-colors"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} more information about ${partner.companyName}`}
        >
          <span className="text-center text-blue-500 text-xs font-normal font-['Poppins'] leading-3">
            More Info
          </span>
          <ChevronRight
            className={`h-5 text-blue-500 transition-transform duration-200 origin-center ${isExpanded ? 'rotate-0' : 'rotate-90'
              }`}
            strokeWidth={1}
          />
        </button>
      </div>

      {/* Always Visible Details */}
      <div className="w-full">
        <DetailRow showBorder={false} label="Company Name" value={partner.companyName} />
        <DetailRow label="Phone" value={partner.phone} />
      </div>

      {/* Expandable Details */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
