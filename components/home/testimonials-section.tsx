'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';

/** Testimonial video configuration */
interface Testimonial {
	id: string;
	thumbnailUrl: string;
	videoUrl: string;
	quote: string;
	customerName?: string;
}

/** Static testimonials data */
const testimonials: Testimonial[] = [
	{
		id: 'testimonial-1',
		thumbnailUrl: '/images/logo-transparent.jpg',
		videoUrl: '/videos/dummy.mp4',
		quote: 'I got my loan approved faster than I ever expected completely hassle-free!',
		customerName: 'Sarah M.',
	},
	{
		id: 'testimonial-2',
		thumbnailUrl: '/images/logo-transparent.jpg',
		videoUrl: '/videos/dummy.mp4',
		quote: 'WeCredit made the entire process so simple. Highly recommended!',
		customerName: 'Rahul K.',
	},
	{
		id: 'testimonial-3',
		thumbnailUrl: '/images/logo-transparent.jpg',
		videoUrl: '/videos/dummy.mp4',
		quote: 'Best loan experience I have ever had. Quick approval and great rates!',
		customerName: 'Priya S.',
	},
	{
		id: 'testimonial-4',
		thumbnailUrl: '/images/logo-transparent.jpg',
		videoUrl: '/videos/dummy.mp4',
		quote: 'From application to disbursement, everything was seamless!',
		customerName: 'Amit P.',
	},
];

/**
 * Testimonials video carousel section
 * Displays customer video testimonials in a centered carousel with side preview
 */
const TestimonialsSection = (): React.ReactNode => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
	const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: 'center',
		containScroll: false,
	});

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on('select', onSelect);
		return () => {
			emblaApi.off('select', onSelect);
		};
	}, [emblaApi, onSelect]);

	/** Pause video when slide changes */
	useEffect(() => {
		if (playingVideoId) {
			const currentTestimonial = testimonials[selectedIndex];
			if (currentTestimonial && playingVideoId !== currentTestimonial.id) {
				const videoElement = videoRefs.current.get(playingVideoId);
				if (videoElement) {
					videoElement.pause();
				}
				setPlayingVideoId(null);
			}
		}
	}, [selectedIndex, playingVideoId]);

	const scrollTo = useCallback(
		(index: number) => {
			if (emblaApi) emblaApi.scrollTo(index);
		},
		[emblaApi]
	);

	const handlePlayClick = (testimonialId: string): void => {
		const videoElement = videoRefs.current.get(testimonialId);
		if (videoElement) {
			if (playingVideoId === testimonialId) {
				videoElement.pause();
				setPlayingVideoId(null);
			} else {
				// Pause any other playing video
				if (playingVideoId) {
					const prevVideo = videoRefs.current.get(playingVideoId);
					if (prevVideo) prevVideo.pause();
				}
				videoElement.play();
				setPlayingVideoId(testimonialId);
			}
		}
	};

	const handleVideoEnded = (testimonialId: string): void => {
		if (playingVideoId === testimonialId) {
			setPlayingVideoId(null);
		}
	};

	const setVideoRef = (id: string, element: HTMLVideoElement | null): void => {
		if (element) {
			videoRefs.current.set(id, element);
		} else {
			videoRefs.current.delete(id);
		}
	};

	return (
		<section className="bg-white py-8 sm:py-10 md:py-12 overflow-hidden">
			{/* Section Title */}
			<motion.h2
				className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8 px-4"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
			>
				Real Results / Testimonials
			</motion.h2>

			{/* Embla Carousel Container */}
			<div className="relative" ref={emblaRef}>
				<div className="flex items-center">
					{testimonials.map((testimonial, index) => {
						const isActive = index === selectedIndex;
						const isPrev = index === (selectedIndex - 1 + testimonials.length) % testimonials.length;
						const isNext = index === (selectedIndex + 1) % testimonials.length;
						const isAdjacent = isPrev || isNext;
						const isPlaying = playingVideoId === testimonial.id;

						return (
							<div
								key={testimonial.id}
								className="flex-[0_0_70%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_35%] min-w-0 px-1.5 sm:px-2"
							>
								<motion.div
									className="relative overflow-hidden transition-all duration-500 ease-out"
									style={{
										borderRadius: '2rem',
										transform: isActive ? 'scale(1)' : 'scale(0.88)',
										opacity: isActive ? 1 : isAdjacent ? 0.9 : 0.5,
									}}
									initial={{ opacity: 0, scale: 0.85 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.08 }}
								>
									{/* Video Thumbnail Container */}
									<div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem]">
										{/* Video Element - Hidden until playing */}
										<video
											ref={(el) => setVideoRef(testimonial.id, el)}
											src={testimonial.videoUrl}
											className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
												isPlaying ? 'opacity-100 z-10' : 'opacity-0 z-0'
											}`}
											playsInline
											onEnded={() => handleVideoEnded(testimonial.id)}
										/>

										{/* Thumbnail Image - Hidden when playing */}
										<Image
											src={testimonial.thumbnailUrl}
											alt={`${testimonial.customerName || 'Customer'} testimonial`}
											fill
											className={`object-contain transition-opacity duration-300 ${
												isPlaying ? 'opacity-0' : 'opacity-100'
											}`}
											sizes="(max-width: 640px) 70vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, 35vw"
										/>

										{/* Teal Gradient Overlay for non-active cards */}
										<div
											className="absolute inset-0 transition-opacity duration-500 z-20"
											style={{
												background:
													'linear-gradient(180deg, rgba(45, 85, 80, 0.7) 0%, rgba(30, 70, 65, 0.8) 50%, rgba(20, 55, 50, 0.9) 100%)',
												opacity: isActive ? 0 : 1,
												pointerEvents: 'none',
											}}
										/>

										{/* Play/Pause Button - Only interactive on active card */}
										<button
											type="button"
											onClick={() => handlePlayClick(testimonial.id)}
											className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 z-30"
											style={{
												opacity: isActive ? 1 : 0.3,
												pointerEvents: isActive ? 'auto' : 'none',
											}}
											aria-label={isPlaying ? 'Pause video' : 'Play video'}
										>
											{isPlaying ? (
												<Pause
													className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-800"
													fill="currentColor"
													strokeWidth={0}
												/>
											) : (
												<Play
													className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-800 ml-0.5"
													fill="currentColor"
													strokeWidth={0}
												/>
											)}
										</button>

										{/* Bottom Gradient for Text Readability */}
										<div
											className="absolute bottom-0 left-0 right-0 h-2/5 transition-opacity duration-500 z-20"
											style={{
												background:
													'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)',
												opacity: isActive && !isPlaying ? 1 : 0,
												pointerEvents: 'none',
											}}
										/>

										{/* Testimonial Quote - Only visible on active card when not playing */}
										<div
											className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 transition-opacity duration-500 z-20"
											style={{ opacity: isActive && !isPlaying ? 1 : 0 }}
										>
											<p className="text-white text-center text-xs sm:text-sm md:text-base font-medium italic leading-relaxed">
												{testimonial.quote}
											</p>
										</div>
									</div>
								</motion.div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Dot Indicators */}
			<div className="flex justify-center gap-2 mt-5 sm:mt-6">
				{testimonials.map((_, index) => (
					<button
						key={index}
						type="button"
						onClick={() => scrollTo(index)}
						className={`wc-dot ${index === selectedIndex ? 'wc-dot-active' : ''}`}
						aria-label={`Go to testimonial ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
};

export default TestimonialsSection;

