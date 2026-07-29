"use client"
import React from 'react';
import { Partner } from '@/types/wecredit';
import { PARTNERS } from '@/lib/constants/common';
import PartnerCard from './partner-card';
import { motion } from 'framer-motion';
const PartnersSection = (): React.ReactNode => {
	const halfIndex = Math.ceil(PARTNERS.length / 2);
	const row1Partners: Partner[] = PARTNERS.slice(0, halfIndex);
	const row2Partners: Partner[] = PARTNERS.slice(halfIndex);
	const row1Doubled: Partner[] = [...row1Partners, ...row1Partners];
	const row2Doubled: Partner[] = [...row2Partners, ...row2Partners];

	return (
		<section className="bg-white wc-section-gap overflow-hidden">
			<motion.h2
				className="wc-section-heading text-gray-900"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				Our Partners
			</motion.h2>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-4 lg:px-0 space-y-4">
				{/* Row 1: Left -> Right */}
				<div className="marquee-container overflow-hidden">
					<div className="flex animate-marquee gap-6">
						{row1Doubled.map((partner, index) => (
							<div key={`partners-row1-${index}`} className="shrink-0 w-28 sm:w-32 lg:w-36">
								<PartnerCard partner={partner} />
							</div>
						))}
					</div>
				</div>

				{/* Row 2: Right -> Left */}
				<div className="marquee-container overflow-hidden">
					<div className="flex animate-marquee-reverse gap-6">
						{row2Doubled.map((partner, index) => (
							<div key={`partners-row2-${index}`} className="shrink-0 w-28 sm:w-32 lg:w-36">
								<PartnerCard partner={partner} />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default PartnersSection;
