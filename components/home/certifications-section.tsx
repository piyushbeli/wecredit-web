import React from 'react';
import { IMAGES } from '@/lib/constants/images';
import CertificationBadge from './certification-badge';

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
      <h2 className="text-xl sm:text-2xl md:text-[18px] font-medium text-center mb-8 sm:mb-6">
        Certified By
      </h2>
      
      <div className="container mx-auto px-4">
  <div className="max-w-xl mx-auto">
    <div className="relative bg-[#00000005] rounded-2xl overflow-hidden border-b-8">
      <div className="px-6 py-8">
        <div className="flex justify-between items-center gap-6 max-w-xl mx-auto">

                {/* ISO Badge 1 */}
                <CertificationBadge
                  src={IMAGES.CERTIFICATIONS.ISO_BADGE_1}
                  alt="ISO Certification Badge"
                  width={140}
                  height={140}
                />

                {/* CII Logo */}
                <CertificationBadge
                  src={IMAGES.CERTIFICATIONS.CII_LOGO}
                  alt="Confederation of Indian Industry"
                  width={300}
                  height={300}
                />

                {/* ISO Certified Company Badge */}
                <CertificationBadge
                  src={IMAGES.CERTIFICATIONS.ISO_CERTIFIED}
                  alt="ISO Certified Company"
                  width={120}
                  height={120}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
