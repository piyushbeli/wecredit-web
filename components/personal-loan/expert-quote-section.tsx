'use client';

/**
 * Expert Quote Section Component
 * Displays a testimonial card from an expert
 */

import { JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import { EXPERT_QUOTE, EXPERT_QUOTE_INFO } from './constants';
import Link from 'next/link';

/**
 * Expert Quote Section
 * Displays expert testimonial with gradient background
 */
const ExpertQuoteSection = (): JSX.Element => {
	return (
		<section className="py-6 px-4 md:px-0 md:py-20">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
				className="max-w-3xl mx-auto md:max-w-7xl md:px-4 lg:px-8 xl:px-0"
			>
				{/* Card Container */}
				<div className="relative bg-brand-lightest rounded-lg overflow-hidden p-5 md:bg-gradient-to-r md:from-[#cfe1fb] md:to-white md:p-8">
					{/* Section Title */}
					<h2 className="text-base font-medium text-gray-900 mb-4 md:text-center md:text-[32px] md:font-semibold md:leading-tight md:text-[#303236]">
						{EXPERT_QUOTE_INFO.title}
					</h2>

					{/* Quote Text */}
					<p className="text-gray-700 text-sm font-light leading-7 tracking-tight pr-12 mb-6 md:pr-0 md:text-lg md:font-normal md:leading-6">
						{EXPERT_QUOTE.quote}
					</p>

					{/* Expert Info */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{/* Avatar */}
							<div className="w-14 h-14 rounded-full bg-white overflow-hidden relative md:h-12 md:w-12">
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
								<p className="text-gray-900 text-base font-medium leading-9 md:text-lg md:font-semibold md:leading-6">
									{EXPERT_QUOTE.name}
								</p>
								<p className="text-gray-700 text-sm font-light leading-7 tracking-tight md:text-base md:font-normal md:leading-6">
									{EXPERT_QUOTE.designation}
								</p>
							</div>
						</div>

						{/* Decorative Quote Icon - Bottom Right */}
						<div className="w-10 h-10 bg-brand-primary rounded-sm overflow-hidden flex items-center justify-center">
							<Link href={EXPERT_QUOTE.linkedinUrl} target="_blank" rel="noopener noreferrer">
								<Linkedin className="h-6 w-6 text-white" fill="currentColor" strokeWidth={0} />
							</Link>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
};

export default ExpertQuoteSection;
