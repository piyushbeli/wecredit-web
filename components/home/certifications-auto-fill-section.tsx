import React from 'react';
import Image from 'next/image';
import { IMAGES } from '@/lib/constants/images';
import CertificationBadge from './certification-badge';



/**
 * Certifications Section Component
 * Displays WeCredit's certifications including ISO badges and CII logo
 * Features a card with gradient bottom border
 * 
 * @returns React component showing certification badges in a styled card
 */
const CertificationsAutoFillSection = (): React.ReactNode => {
	return (
		<section className="bg-white py-4 sm:py-10 md:py-12">
			<div className="container mx-auto px-4 sm:px-6 md:px-8">
				{/* Main Certifications Card */}
				<div className="">
					{/* Card with gradient bottom border */}
					<div
						className="relative rounded-2xl overflow-hidden"
					>
						{/* Main Content Area */}
						<div className="">
							{/* Certification Logos Grid */}
							<div className="flex justify-around items-center gap-4 sm:gap-6 md:gap-10 max-w-4xl mx-auto">
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

export default CertificationsAutoFillSection;
