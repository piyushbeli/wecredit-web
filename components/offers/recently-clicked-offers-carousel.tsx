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
	const { lenderName, uptoAmount, intRate, tenure, logo, wcStatus } = offer;

	return (
		<button
			onClick={onClick}
			className="w-full rounded-[8px] overflow-hidden pt-2 pb-2 pr-[10px] pl-[10px] text-left relative"
			style={{
				background: 'linear-gradient(96.83deg, #CCDFFC 35.72%, #FAFCFF 100%)',
			}}
		>
			<div className="absolute right-1.5 top-1.5">
				<StatusBadge status={wcStatus} />
			</div>

			{/* Lender Logo */}
			<div className="w-[80px] h-[24px] flex items-center justify-start overflow-hidden">
				{logo ? (
					<Image
						src={logo}
						alt={lenderName}
						width={80}
						height={24}
						className="max-h-[24px] w-auto object-contain"
					/>
				) : (
					<span className="text-sm font-medium text-gray-800 truncate">
						{lenderName}
					</span>
				)}
			</div>



			{/* Amount */}
			<h3
				className="ml-[0px] mb-[8px] mt-[8px]"
				style={{
					fontFamily: 'Poppins, sans-serif',
					fontWeight: 500,
					fontSize: '14px',
					lineHeight: '120%',
				}}
			>
				Amount upto {uptoAmount}
			</h3>

			{/* Rate & Tenure */}
			<div className="flex items-center gap-4 mb-1 text-xs text-gray-600">
				{intRate && (
					<div className="flex items-center gap-1.5 font-light leading-none">
						<PercentIcon />
						<span>Int. rate {intRate}%</span>
					</div>
				)}
				{tenure && (
					<div className="flex items-center gap-1.5 font-light leading-none">
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
		<section className="mb-4  mx-auto max-w-xl">
			{/* Section Title */}
			<h2 className="text-sm font-light text-black-900 mb-4 ml-4 mt-5 lg:ml-0">
				Recently Clicked Offers
			</h2>

			{/* Carousel */}
			<div>
				<Carousel
					options={{
						align: 'start',
						loop: false,
						slidesToScroll: 1,
					}}
				><CarouselContent className=" max-w-xl">
						{offers.map((offer, index) => {
							const isFirst = index === 0;
							const isLast = index === offers.length - 1;
							const singleOffer =isFirst && isLast; // Only one offer in the carousel

							return (
								<CarouselSlide
									key={`${offer.lenderName}-${index}`}
									className={`pl-4 ${isLast ? 'pr-4' : ''} ${singleOffer ? 'basis-[100%]' : 'basis-[85%]'} sm:basis-[70%] md:basis-[50%]`}
								>
									<RecentlyClickedOfferCard
										offer={offer}
										onClick={() => onOfferClick(offer)}
									/>
								</CarouselSlide>
							);
						})}
					</CarouselContent>


					{/* Pagination Dots - Only show if more than one offer */}
					{offers.length > 1 && (
						<CarouselDots
							className="flex items-center justify-center gap-[2px] h-[8px] mt-4"
							renderDot={(index, isActive) => (
								<div
									className={`rounded-full transition-all duration-200 ${isActive
										? 'w-[8px] h-[8px] bg-blue-600'
										: 'w-[6px] h-[6px] bg-gray-400'
										}`}
								/>
							)}
						/>

					)}
				</Carousel>
			</div>
		</section>
	);
}
