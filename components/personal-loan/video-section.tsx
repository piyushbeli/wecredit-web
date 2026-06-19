'use client';

/**
 * Video Section Component
 * Displays personal loan info with embedded video thumbnail
 */

import { JSX, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { VIDEO_CONFIG } from './constants';
import { IMAGES } from '@/lib/constants/images';

/**
 * Video Section for Personal Loan Page
 * Card with gradient background, description, and video thumbnail
 */
const VideoSection = (): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = useCallback((): void => {
    setIsPlaying(true);
  }, []);

  const videoDuration = '02:23';

  return (
    <section className="bg-white px-4 py-8 md:px-0 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl md:max-w-none"
      >
        {/* Gradient Card */}
        <div className="bg-brand-lightest rounded-2xl overflow-hidden p-8 md:rounded-none md:bg-gradient-to-r md:from-[#cfe1fb] md:to-white md:px-0 md:py-8 lg:py-10">
          <div className="mx-auto md:grid md:max-w-7xl md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-12 md:px-4 lg:px-8 xl:px-0">
            <div>
              {/* Title */}
              <h2 className="text-center text-black/80 text-[28px] font-semibold leading-tight mb-6 md:mb-7 md:text-left md:text-[30px] lg:text-[34px]">
                Personal Loan
              </h2>

              {/* Description */}
              <p className="text-zinc-500 text-lg font-normal leading-7 mb-8 sm:text-xl sm:leading-8 md:mb-0 md:max-w-[520px] md:text-lg md:leading-7 lg:text-xl lg:leading-8">
                At WeCredit, compare offers and apply for an instant personal loan ranging from ₹5,000 to ₹15 lakh, with interest rates starting from 9.99% p.a.* Choose from{' '}
                <span className="text-neutral-900 font-semibold">25+ reputed lenders</span>
                . Select a repayment tenure from 6 months to 5 years with EMIs that suit your budget. No collateral is required, and approval in minutes.
              </p>
            </div>

            {/* Video Thumbnail */}
            <div className="relative aspect-video rounded-sm overflow-hidden bg-gray-200 md:rounded md:justify-self-stretch">
              {isPlaying ? (
                <iframe
                  src={`${VIDEO_CONFIG.videoUrl}?autoplay=1`}
                  title={VIDEO_CONFIG.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Thumbnail Image */}
                  <Image
                    src={IMAGES.DIRECT_CONTACT_EXPERTS.LAKASH}
                    alt={VIDEO_CONFIG.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />

                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={handlePlayClick}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#6075ff] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10 sm:h-24 sm:w-24 md:h-24 md:w-24"
                    aria-label="Play video"
                  >
                    <Play className="w-9 h-9 text-white ml-1 sm:h-11 sm:w-11 md:h-11 md:w-11" fill="currentColor" />
                  </button>

                  {/* Bottom Overlay with Title and Duration */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-3">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/30 rounded-full mb-2">
                      <div className="w-1/6 h-full bg-wc-blue-500 rounded-full" />
                    </div>

                    {/* Title and Duration */}
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium uppercase tracking-wide md:text-base">
                        Watch: How WeCredit Works
                      </span>
                      <span className="text-white/80 text-xs md:text-base">
                        {videoDuration}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;
