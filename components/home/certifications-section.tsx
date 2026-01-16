import React from 'react';
import Image from 'next/image';

/**
 * Certification badge component
 * Displays a single certification logo with placeholder support
 */
const CertificationBadge = ({
  src,
  alt,
  width = 180,
  height = 180,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}): React.ReactNode => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain"
          priority={false}
        />
      </div>
    </div>
  );
};

/**
 * Certifications Section Component
 * Displays WeCredit's certifications including ISO badges and CII logo
 * Features a card with gradient bottom border
 * 
 * @returns React component showing certification badges in a styled card
 */
const CertificationsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-4 sm:py-10 md:py-12">
      {/* Section Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
        Certified By
      </h2>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Main Certifications Card */}
        <div className="max-w-5xl mx-auto">
          {/* Card with gradient bottom border */}
          <div 
            className="relative bg-[#FCFAFE] rounded-2xl rounded-b-3xl overflow-hidden border-b-8 border-b-brand-light-from  to-brand-light-to"
          >
            {/* Main Content Area */}
            <div className="px-6 py-8 sm:px-8 sm:py-14 md:px-12 md:py-16">
              {/* Certification Logos Grid */}
              <div className="flex justify-around items-center gap-4 sm:gap-6 md:gap-10 max-w-4xl mx-auto">
                {/* ISO Badge 1 */}
                <CertificationBadge
                  src="/images/certifications/iso-badge-1.png"
                  alt="ISO Certification Badge"
                  width={140}
                  height={140}
                />

                {/* CII Logo */}
                <CertificationBadge
                  src="/images/certifications/cii-logo.png"
                  alt="Confederation of Indian Industry"
                  width={300}
                  height={300}
                />

                {/* ISO Certified Company Badge */}
                <CertificationBadge
                  src="/images/certifications/iso-certified-company.png"
                  alt="ISO Certified Company"
                  width={120}
                  height={120}
                />
              </div>
            </div>
          </div>

          {/* Bottom Section - Bank Empanelment */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 text-center">
              Bank Empanelment/Certifications etc
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
