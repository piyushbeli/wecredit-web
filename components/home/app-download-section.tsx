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
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-24">
      <div className={cn(
        "relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem]",
        "px-8 py-6 md:px-20 md:py-20",
        "flex flex-col md:flex-row items-start border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      )}>
        {/* Blue Gradient/Glow behind mock - from design snippet */}
        <div className="absolute w-[180px] h-[160px] md:w-[300px] md:h-[260px] right-0 bottom-0 bg-brand-primary blur-[60px] md:blur-[100px] opacity-70 rounded-full" />

        {/* Text and Badges Content */}
        <div className="z-10 flex flex-col items-start gap-28 w-full md:w-1/2">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-tight text-gray-900">
              No more Waiting.<br />
              Get up to <span className="text-brand-primary">₹3 Lakh</span> in Minutes
            </h2>
            <div className="flex items-start gap-3 text-lg font-normal text-gray-500 md:text-2xl">
              <span>Download The WeCredit App Now</span>
              <ArrowDown className="h-6 w-6 md:h-8 md:w-8" />
            </div>
          </div>

          <div className="space-y-6">

            {/* App Store Badges - Stacked vertically */}
            <div className="flex flex-col gap-3 md:gap-4">
              <a 
                href={EXTERNAL_LINKS.PLAY_STORE} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all hover:opacity-80 active:scale-95 w-fit"
              >
                <Image
                  src={IMAGES.APP.GOOGLE_PLAY}
                  alt="Get it on Google Play"
                  width={180}
                  height={54}
                  className="h-11 w-auto md:h-14 lg:h-16"
                />
              </a>
              {/* <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-all hover:opacity-80 active:scale-95 w-fit"
              >
                <Image
                  src={IMAGES.APP.APP_STORE}
                  alt="Download on the App Store"
                  width={180}
                  height={54}
                  className="h-11 w-auto md:h-14 lg:h-16"
                />
              </a> */}
            </div>
          </div>
        </div>

        {/* Phone Mockup - Positioned at bottom-right */}
        <div className="absolute right-0 bottom-0 w-[45%] md:w-[40%] lg:w-[35%] pointer-events-none select-none">
          <Image
            src={IMAGES.APP.MOCKUP}
            alt="WeCredit App Mockup"
            width={600}
            height={600}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
