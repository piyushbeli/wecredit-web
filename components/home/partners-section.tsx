
import React from 'react';
import { Partner } from '@/types/wecredit';
import { ROW_1_PARTNERS, ROW_2_PARTNERS, ROW_3_PARTNERS } from '@/lib/constants/common';
import PartnerCard from './partner-card';

/**
 * Marquee row component - displays partners in an infinite scroll
 */
const MarqueeRow = ({
	partners,
	isReverse = false,
}: {
	partners: Partner[];
	isReverse?: boolean;
}): React.ReactNode => {
	const animationClass = isReverse ? 'animate-marquee-reverse' : 'animate-marquee';
	return (
		<div className="marquee-container overflow-hidden py-2">
			<div className={`flex ${animationClass}`} style={{ width: 'fit-content' }}>
				{/* First set of logos */}
				{partners.map((partner, index) => (
					<PartnerCard key={`first-${partner.name}-${index}`} partner={partner} />
				))}
				{/* Duplicate set for seamless loop */}
				{partners.map((partner, index) => (
					<PartnerCard key={`second-${partner.name}-${index}`} partner={partner} />
				))}
			</div>
		</div>
	);
};

/**
 * Our Partners section with infinite marquee animation
 * Displays partner logos in 3 rows with horizontal scrolling effect
 */
const PartnersSection = (): React.ReactNode => {
	return (
		<section className="bg-white py-8 sm:py-10 md:py-12 overflow-hidden">
			{/* Container with blue left border accent */}
				{/* Section Title */}
				<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
					Our Partners
				</h2>
			<div className="px-1 sm:pl-6 md:pl-8">

				{/* Marquee Rows */}
				<div className="space-y-2 sm:space-y-3">
					{/* Row 1 - scrolls left */}
					<MarqueeRow partners={ROW_1_PARTNERS} />
					{/* Row 2 - scrolls right (reverse) */}
					<MarqueeRow partners={ROW_2_PARTNERS} isReverse />
					{/* Row 3 - scrolls left */}
					<MarqueeRow partners={ROW_3_PARTNERS} />
				</div>
			</div>
		</section>
	);
};

export default PartnersSection;
