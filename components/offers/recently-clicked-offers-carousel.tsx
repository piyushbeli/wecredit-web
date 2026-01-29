/**
 * RecentlyClickedOffersCarousel Component
 * 
 * Horizontal scrollable carousel for displaying recently clicked offers (UTM_CLICKED status)
 * Shows offers with "UTM Clicked" badge at the top of the offers page
 */

'use client';

import type { LenderOfferStatus } from '@/types/wecredit';
import { Carousel, CarouselContent, CarouselSlide, CarouselDots } from '@/components/ui/carousel';
import Image from 'next/image';
import { PercentIcon, CalendarIcon } from '@/components/icons';
import { StatusBadge } from './status-badge';

interface RecentlyClickedOffersCarouselProps {
	/** Array of recently clicked offers */
	offers: LenderOfferStatus[];
	/** Click handler for individual offer cards */
	onOfferClick: (offer: LenderOfferStatus) => void;
}

/**
 * Single offer card for the carousel
 * Compact version showing lender logo, amount, and key details
 */
function RecentlyClickedOfferCard({
	offer,
	onClick
}: {
	offer: LenderOfferStatus;
	onClick: () => void;
}) {
	const { lenderName, loanAmount, interestRate, tenure, logo, wcStatus } = offer;

	return (
		<button
			onClick={onClick}
			className="w-full rounded-2xl overflow-hidden p-3 text-left relative"
			style={{
				background: 'linear-gradient(145deg, #D4E4FC 0%, #EEF4FF 50%, #FAFCFF 100%)',
			}}
		>


			<div className="absolute right-3 top-3">
				<StatusBadge status={wcStatus} />
			</div>

			{/* Lender Logo */}
			<div className="mb-2">
				{logo ? (
					<Image
						src={logo}
						alt={lenderName}
						width={80}
						height={10}
						className="object-contain h-4 w-auto"
					/>
				) : (
					<div className="flex items-center gap-1.5">
						<div className="w-6 h-6 rounded-lg bg-wc-blue-500 flex items-center justify-center">
							<span className="text-white text-xs font-bold">
								{lenderName.charAt(0)}
							</span>
						</div>
						<span className="text-sm font-semibold text-gray-800">
							{lenderName}
						</span>
					</div>
				)}
			</div>

			{/* Amount */}
			<h3 className="font-medium text-xs mb-1.5 text-gray-900">
				Amount upto {loanAmount}
			</h3>

			{/* Rate & Tenure */}
			<div className="flex items-center gap-4 text-xs text-gray-600">
				{interestRate && (
					<div className="flex items-center gap-0.5">
						<PercentIcon />
						<span>Int. rate {interestRate}%</span>
					</div>
				)}
				{tenure && (
					<div className="flex items-center gap-0.5">
						<CalendarIcon />
						<span>Upto {tenure} m</span>
					</div>
				)}
			</div>
		</button>
	);
}

/**
 * Carousel component for recently clicked offers
 * Displays offers in a horizontal scrollable layout with pagination dots
 */
export function RecentlyClickedOffersCarousel({
	offers,
	onOfferClick
}: RecentlyClickedOffersCarouselProps) {
	// Early return: Don't render if no offers
	if (offers.length === 0) {
		return null;
	}

	return (
		<section className="mb-6">
			{/* Section Title */}
			<h2 className="text-sm font-medium text-gray-900 mb-3 px-4">
				Recently Clicked Offers
			</h2>

			{/* Carousel */}
			<div className="px-4">
				<Carousel
					options={{
						align: 'start',
						loop: false,
						slidesToScroll: 1,
					}}
				>
					<CarouselContent className="-ml-3">
						{offers.map((offer, index) => (
							<CarouselSlide
								key={`${offer.lenderName}-${index}`}
								className="pl-3 basis-[85%] sm:basis-[70%] md:basis-[50%]"
							>
								<RecentlyClickedOfferCard
									offer={offer}
									onClick={() => onOfferClick(offer)}
								/>
							</CarouselSlide>
						))}
					</CarouselContent>

					{/* Pagination Dots - Only show if more than one offer */}
					{offers.length > 1 && (
						<div className="flex justify-center mt-3">
							<CarouselDots />
						</div>
					)}
				</Carousel>
			</div>
		</section>
	);
}
