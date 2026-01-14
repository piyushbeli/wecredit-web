/**
 * OTP Illustration Component
 * 
 * SVG illustration of a hand holding a phone with messaging/notification
 * Used in the OTP input screen to match the design
 */

export const OTPIllustration = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hand */}
      <g>
        {/* Palm */}
        <path
          d="M90 120C90 120 95 150 110 165C125 180 140 180 145 175L155 155L130 130L90 120Z"
          fill="#FBBF77"
          stroke="#E89D4F"
          strokeWidth="2"
        />
        
        {/* Thumb */}
        <path
          d="M90 120L85 110C83 105 85 100 90 100C95 100 98 103 98 108L100 120"
          fill="#FBBF77"
          stroke="#E89D4F"
          strokeWidth="2"
        />
        
        {/* Watch/Bracelet */}
        <ellipse
          cx="97"
          cy="135"
          rx="12"
          ry="8"
          fill="#2D3748"
          opacity="0.8"
        />
      </g>

      {/* Phone */}
      <g>
        {/* Phone body */}
        <rect
          x="80"
          y="60"
          width="50"
          height="90"
          rx="8"
          fill="white"
          stroke="#E2E8F0"
          strokeWidth="2"
        />
        
        {/* Screen */}
        <rect
          x="85"
          y="68"
          width="40"
          height="75"
          rx="4"
          fill="#F7FAFC"
        />
        
        {/* Notch */}
        <rect
          x="100"
          y="65"
          width="10"
          height="4"
          rx="2"
          fill="#CBD5E0"
        />
        
        {/* OTP boxes on screen */}
        <g opacity="0.6">
          <rect x="90" y="110" width="6" height="8" rx="1" fill="#CBD5E0" />
          <rect x="98" y="110" width="6" height="8" rx="1" fill="#CBD5E0" />
          <rect x="106" y="110" width="6" height="8" rx="1" fill="#CBD5E0" />
          <rect x="114" y="110" width="6" height="8" rx="1" fill="#CBD5E0" />
        </g>
        
        {/* Text lines on screen */}
        <line x1="90" y1="85" x2="115" y2="85" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="95" x2="105" y2="95" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Message bubble with checkmark (notification) */}
      <g>
        {/* Bubble background */}
        <rect
          x="125"
          y="45"
          width="45"
          height="28"
          rx="6"
          fill="white"
          filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
        />
        
        {/* Message lines */}
        <line x1="132" y1="55" x2="160" y2="55" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
        <line x1="132" y1="62" x2="152" y2="62" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" />
        
        {/* Small tail */}
        <path
          d="M130 70L125 75L128 70Z"
          fill="white"
        />
      </g>

      {/* Decorative elements */}
      <g opacity="0.3">
        {/* Small circles around */}
        <circle cx="65" cy="80" r="4" fill="currentColor" />
        <circle cx="145" cy="140" r="3" fill="currentColor" />
        <circle cx="70" cy="130" r="3" fill="currentColor" />
      </g>
    </svg>
  );
};

export default OTPIllustration;
