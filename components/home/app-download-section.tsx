import React from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/constants/images';
import { EXTERNAL_LINKS } from '@/lib/constants/links';

/**
 * AppDownloadSection Component
 * 
 * Displays a call-to-action for downloading the WeCredit mobile app.
 * Features a gradient background, responsive text, app store badges,
 * and a phone mockup positioned at the bottom-right.
 */
const AppDownloadSection = (): React.ReactNode => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-4 lg:py-16 xl:px-0 xl:py-24">
      <div
        className={cn(
          'relative min-h-[520px] overflow-hidden rounded-[28px] bg-white sm:min-h-[600px] md:min-h-[560px] md:rounded-[36px] lg:min-h-0',
          'px-6 py-8 sm:px-10 sm:py-12 md:px-10 md:py-10 lg:px-12 lg:py-14 xl:px-20 xl:py-20',
          'flex flex-col items-start lg:flex-row lg:items-center'
        )}
      >
        {/* Gradient glow behind mock */}
        <div className="absolute bottom-0 right-0 h-[62%] w-full pointer-events-none md:top-auto md:h-[58%] md:w-[76%] lg:top-0 lg:h-full lg:w-[44%] xl:w-[48%]">
          <div className="w-full h-full bg-gradient-to-bl from-[#5EA1FF] via-[#EAF4FF] to-white opacity-95 blur-[20px] rounded-tr-[28px]" />
        </div>

        {/* Left column: heading, subtitle, badges */}
        <div className="relative z-20 w-full lg:w-2/3">
          <h2 className="max-w-[680px] text-[28px] font-semibold leading-tight text-gray-900 sm:text-4xl md:text-[34px] lg:text-4xl xl:text-5xl">
            No more Waiting.
            <br />
            Get up to <span className="text-brand-primary">₹3 Lakh</span> in Minutes
          </h2>

          <p className="mt-5 flex items-center gap-2 text-lg text-gray-700 sm:text-2xl md:mt-5 md:gap-2 md:text-xl lg:text-2xl lg:gap-3 xl:text-3xl">
            <span>Download The WeCredit App Now</span>
            <ArrowDown className="h-6 w-6 shrink-0 md:h-6 md:w-6" />
          </p>

          <div className="mt-8 flex items-start gap-6 md:mt-7 lg:mt-7 xl:mt-8">
            {/* Badges stacked */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <a href={EXTERNAL_LINKS.PLAY_STORE} target="_blank" rel="noreferrer" className="inline-block">
                <Image src={IMAGES.APP.GOOGLE_PLAY} alt="Get it on Google Play" width={260} height={64} className="h-12 w-auto rounded-md shadow-sm sm:h-14 md:h-11 lg:h-12 xl:h-14" />
              </a>
              {/* {IMAGES.APP.APP_STORE && (
                <a href={EXTERNAL_LINKS.APP_STORE || '#'} target="_blank" rel="noreferrer" className="inline-block lg:hidden">
                  <Image src={IMAGES.APP.APP_STORE} alt="Download on the App Store" width={260} height={64} className="h-12 w-auto rounded-md shadow-sm sm:h-14 md:h-11 lg:h-12 xl:h-14" />
                </a>
              )} */}
            </div>

            {/* QR block - hidden on small devices */}
            <div className=" items-center justify-center lg:flex">
              <Image src={IMAGES.APP.QR} alt="QR code" width={140} height={140} className="h-28 w-28 object-contain xl:h-36 xl:w-36" />
            </div>
          </div>
        </div>

        {/* Right column: phone mockup covering right area (less cropped, aligned bottom-right) */}
        <div className="absolute bottom-0 right-0 h-[58%] w-[76%] pointer-events-none select-none z-10 sm:h-[56%] sm:w-[70%] md:h-[52%] md:w-[64%] lg:inset-y-0 lg:h-full lg:w-[44%] xl:w-[50%]">
          <div className="relative h-full w-full rounded-r-2xl overflow-hidden">
            <Image
              src={IMAGES.APP.MOCKUP}
              alt="WeCredit App Mockup"
              fill
              className="object-contain w-full h-full"
              style={{ objectPosition: 'right bottom' }}
              sizes="(min-width: 1280px) 640px, (min-width: 1024px) 44vw, 76vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
