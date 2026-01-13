'use client';

import { motion } from 'framer-motion';

/** Props for PhoneIllustration component */
interface PhoneIllustrationProps {
  className?: string;
}

/**
 * Phone illustration SVG for OTP screen
 * Shows a hand holding a phone with a checkmark
 */
const PhoneIllustration = ({ className }: PhoneIllustrationProps): React.ReactNode => {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hand */}
        <ellipse
          cx="90"
          cy="140"
          rx="55"
          ry="25"
          fill="#FDBF8F"
          opacity="0.9"
        />
        <path
          d="M55 120C55 120 50 130 55 140C60 150 70 155 90 155C110 155 120 150 125 140C130 130 125 120 125 120"
          fill="#F5A96B"
        />
        
        {/* Phone Body */}
        <rect
          x="55"
          y="25"
          width="70"
          height="120"
          rx="12"
          fill="#2D3748"
        />
        
        {/* Phone Screen */}
        <rect
          x="60"
          y="35"
          width="60"
          height="100"
          rx="4"
          fill="#4A90E2"
        />
        
        {/* Screen Content - Message Icon */}
        <rect
          x="70"
          y="55"
          width="40"
          height="30"
          rx="4"
          fill="white"
          opacity="0.9"
        />
        
        {/* Message Lines */}
        <rect x="75" y="62" width="30" height="3" rx="1.5" fill="#E2E8F0" />
        <rect x="75" y="68" width="25" height="3" rx="1.5" fill="#E2E8F0" />
        <rect x="75" y="74" width="20" height="3" rx="1.5" fill="#E2E8F0" />
        
        {/* Checkmark Circle */}
        <motion.circle
          cx="120"
          cy="50"
          r="18"
          fill="#48BB78"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        />
        
        {/* Checkmark */}
        <motion.path
          d="M112 50L117 55L128 44"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        
        {/* Phone Speaker */}
        <rect
          x="82"
          y="28"
          width="16"
          height="3"
          rx="1.5"
          fill="#4A5568"
        />
        
        {/* Home Button */}
        <circle
          cx="90"
          cy="140"
          r="5"
          fill="#4A5568"
        />
        
        {/* Finger highlights */}
        <ellipse
          cx="65"
          cy="135"
          rx="8"
          ry="12"
          fill="#FDBF8F"
        />
        <ellipse
          cx="115"
          cy="135"
          rx="8"
          ry="12"
          fill="#FDBF8F"
        />
      </svg>
    </motion.div>
  );
};

export default PhoneIllustration;
