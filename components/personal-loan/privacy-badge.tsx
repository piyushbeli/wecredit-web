'use client';

import Image from 'next/image';
/**
 * Privacy/Security Badge Component
 * Reusable badge component for displaying privacy and security indicators
 */

import { JSX } from 'react';

interface PrivacyBadgeProps {
  label: string;
  iconImage: string;
  bgColor: string;
  textColor: string;
  borderRadius?: string;
}

/**
 * Privacy Badge Component
 * Displays a badge with an icon and label text
 * Used for privacy and security indicators
 */
const PrivacyBadge = ({ 
  label, 
  iconImage, 
  bgColor, 
  textColor, 
  borderRadius = 'rounded-[34px]' 
}: PrivacyBadgeProps): JSX.Element => {
  return (
    <div className={`px-2 py-1 ${bgColor} ${borderRadius} inline-flex justify-center items-center gap-1`}>
      <div className="flex items-center gap-1">
        <Image src={iconImage} alt="Privacy Badge Icon" width={16} height={16} className="w-4 h-4" />
      </div>
      <span className={`text-center ${textColor} text-xs`}>
        {label}
      </span>
    </div>
  );
};

export default PrivacyBadge;
