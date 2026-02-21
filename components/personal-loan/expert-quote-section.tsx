'use client';

/**
 * Expert Quote Section Component
 * Displays a testimonial card from an expert
 */

import { JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { EXPERT_QUOTE, EXPERT_QUOTE_INFO } from './constants';
import { IMAGES } from '@/lib/constants/images';

/**
 * Expert Quote Section
 * Displays expert testimonial with gradient background
 */
const ExpertQuoteSection = (): JSX.Element => {
	return (
		<section className="py-6 px-4">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
				className="max-w-3xl mx-auto"
			>
				{/* Card Container */}
				<div className="relative bg-brand-lightest rounded-lg overflow-hidden p-5">
					{/* Section Title */}
					<h2 className="text-base font-medium text-gray-900 mb-4">
						{EXPERT_QUOTE_INFO.title}
					</h2>

					{/* Quote Text */}
					<p className="text-gray-700 text-sm font-light leading-7 tracking-tight pr-12 mb-6">
						{EXPERT_QUOTE.quote}
					</p>

					{/* Expert Info */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{/* Avatar */}
							<div className="w-14 h-14 rounded-full bg-white overflow-hidden relative">
								<Image
									src={EXPERT_QUOTE.imageUrl}
									alt={EXPERT_QUOTE.name}
									fill
									className="object-cover"
									sizes="56px"
								/>
							</div>

							{/* Name and Designation */}
							<div>
								<p className="text-gray-900 text-base font-medium leading-9">
									{EXPERT_QUOTE.name}
								</p>
								<p className="text-gray-700 text-sm font-light leading-7 tracking-tight">
									{EXPERT_QUOTE.designation}
								</p>
							</div>
						</div>

						{/* Decorative Quote Icon - Bottom Right */}
						<div className="w-10 h-10 bg-brand-primary/20 rounded-sm overflow-hidden flex items-center justify-center">

							<Image src={IMAGES.DIRECT_CONTACT_EXPERTS.PLAYSTORE_ICON} alt="Hourglass Icon" width={24} height={24} />
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
};

export default ExpertQuoteSection;
