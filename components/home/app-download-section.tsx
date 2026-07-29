import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/constants/images';
import { EXTERNAL_LINKS } from '@/lib/constants/links';

/**
 * AppDownloadSection Component
 *
 * Call-to-action banner for downloading the WeCredit mobile app.
 * White-to-blue gradient, centered logo/heading/CTA, and a phone mockup
 * bleeding off the right edge.
 */
const AppDownloadSection = (): React.ReactNode => {
  return (
    <section className="wc-section-gap mx-auto max-w-7xl px-6 sm:px-6 lg:px-4 xl:px-0">
      <div
        className={cn(
          'relative flex items-center overflow-hidden rounded-[24px] md:rounded-[36px]',
          'min-h-[360px] sm:min-h-[380px] md:min-h-[400px] lg:min-h-[400px] xl:min-h-[440px]',
          'px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-20'
        )}
      >
        {/* Light → royal-blue gradient background (stops matched to the phone artwork so it blends seamlessly) */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#F6FAFF_0%,#F0F7FD_8%,#E4EEFA_16%,#D3E4F8_24%,#BCD4F6_31%,#A1C3F3_39%,#88B2EE_47%,#6FA1E6_55%,#5A91E4_62%,#4485E1_74%,#3B7CE2_86%,#3474DA_100%)]" />

        {/* Phone mockup (background keyed to transparency) bleeding off the bottom-right */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden select-none md:block md:h-[64%] md:w-[48%] lg:inset-y-0 lg:h-full lg:w-[50%]">
          <Image
            src={IMAGES.APP.PHONE_MOCKUP}
            alt="WeCredit app on a smartphone home screen"
            fill
            className="object-contain object-right-bottom"
            sizes="(min-width: 1024px) 50vw, 58vw"
            priority
          />
        </div>

        {/* Centered content */}
        <div className="relative z-10 flex w-full gap-2 flex-col items-center text-center lg:w-[58%]">
          <div className="mb-4 flex items-center justify-center sm:mb-5">
            <Image
              src={IMAGES.LOGOS.DEFAULT}
              alt="WeCredit"
              width={160}
              height={44}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </div>

          <h2 className="text-[30px] font-semibold leading-[1.05] text-[#141414] sm:text-4xl md:text-[44px] lg:text-5xl">
            Download Our
            <br />
            Mobile App
          </h2>

          {/* "today!" layered sticker pill — overlaps up under the heading */}
          <div
            className={cn(
              'relative rotate-351 top-4 z-[-4] -mt-2 inline-flex items-center rounded-full px-8 py-2 sm:-mt-3 sm:px-8 sm:py-3.5',
              'bg-gradient-to-r from-[#689AE4] to-[#091C39]',
            )}
            
          >
            <span className="text-[55px] font-extrabold  leading-none text-white sm:text-[60px]x">
              today!
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center sm:mt-10">
            <a
              href={EXTERNAL_LINKS.PLAY_STORE}
              target="_blank"
              rel="noreferrer"
              aria-label="Get WeCredit on Google Play"
              className="inline-block"
            >
              <Image
                src={IMAGES.APP.GOOGLE_PLAY}
                alt="Get it on Google Play"
                width={220}
                height={66}
                className="h-14 w-auto rounded-lg shadow-md sm:h-16"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
