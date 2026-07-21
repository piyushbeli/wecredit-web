'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselSlide, CarouselDots } from '@/components/ui/carousel';
import { useLoanApplicationStore } from '@/stores/loan-application-store';
import { checkEligibilityStatus } from '@/lib/api/eligibility-check-service';
import {
  STORAGE_CREDIT_SCORE_FETCH_PENDING,
  STORAGE_CREDIT_SCORE_READY,
  STORAGE_MOBILE,
} from '@/lib/constants/api-keys';
import { HERO_CAROUSEL_SLIDES } from '@/lib/constants/common';
import { CREDIT_REPORT_PATH } from '@/lib/constants/credit-report-routes';
import { isUsableBureauReportResponse } from '@/lib/utils/credit-report-adapter';
import type { MouseEvent } from 'react';

/** Slide content configuration */
export interface SlideContent {
  id: string;
  image: string;
  titleWhite: string;
  titleGradient: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

/**
 * Hero carousel section with gradient background, 3D illustration, and swipeable slides
 */
const HeroCarousel = (): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const { triggerApplyFlow } = useLoanApplicationStore();
  const [isCheckingCreditReport, setIsCheckingCreditReport] = useState(false);
  const creditReportRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      creditReportRequestRef.current?.abort();
    };
  }, []);

  const renderCtaElement = (slide: SlideContent) => {
    const isPersonalLoan = slide.ctaLink === '/personal-loan';
    const isBureauReport = slide.ctaLink === '/bureau-report';

    const handleClick = async (e: MouseEvent<HTMLAnchorElement>): Promise<void> => {
      if (isPersonalLoan) {
        e.preventDefault();
        triggerApplyFlow();
        return;
      }
      if (!isBureauReport) {
        return;
      }
      e.preventDefault();
      if (creditReportRequestRef.current) {
        return;
      }

      const mobile = getCookie(STORAGE_MOBILE);
      if (typeof mobile !== 'string' || !mobile.trim()) {
        router.push('/bureau-report/');
        return;
      }

      const controller = new AbortController();
      creditReportRequestRef.current = controller;
      setIsCheckingCreditReport(true);

      try {
        const result = await checkEligibilityStatus(mobile, controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        if (result.showSuccess && isUsableBureauReportResponse(result.data)) {
          sessionStorage.removeItem(STORAGE_CREDIT_SCORE_FETCH_PENDING);
          sessionStorage.setItem(STORAGE_CREDIT_SCORE_READY, '1');
          router.push(CREDIT_REPORT_PATH);
          return;
        }
        router.push('/bureau-report/');
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingCreditReport(false);
        }
        creditReportRequestRef.current = null;
      }
    };

    return (
      <Link
        href={slide.ctaLink}
        onClick={handleClick}
        aria-disabled={isBureauReport && isCheckingCreditReport}
        className="inline-flex items-center justify-center px-8 py-3.5 bg-wc-blue-500 hover:bg-wc-blue-600 text-white text-base font-semibold rounded-lg transition-all duration-300 active:scale-95"
      >
        {slide.ctaText}
      </Link>
    );
  };

  return (
    <section className="wc-hero-bg min-h-[480px] lg:min-h-[520px] relative pt-20 lg:pt-24 pb-4">

      <h1 className="sr-only">Compare Loans & Credit Offers Online</h1>
      <Carousel
        key={pathname}
        options={{ loop: true, align: 'center' }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="relative z-10 h-full flex flex-col"
      >
        <CarouselContent className="flex-1">
          {HERO_CAROUSEL_SLIDES.map((slide, index) => {
            const ctaElement = renderCtaElement(slide);

            return (
              <CarouselSlide
                key={slide.id}
                className="flex-[0_0_100%] px-4 sm:px-6 lg:px-8"
              >
                <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[360px] lg:min-h-[400px]">
                  <motion.div
                    className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-1">
                      {slide.titleWhite}
                    </h2>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold wc-gradient-text leading-tight mb-4">
                      {slide.titleGradient}
                    </p>
                    <p className="text-sm hidden md:block sm:text-base text-gray-600 max-w-md mb-6 leading-relaxed">
                      {slide.description}
                    </p>
                    {ctaElement}
                  </motion.div>

                  <motion.div
                    className="order-1 lg:order-2 relative w-full h-48 sm:h-56 lg:h-80"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
                  >
                    <Image
                      src={slide.image}
                      alt="WeCredit Hero"
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority={index === 0}
                    />
                  </motion.div>
                </div>
              </CarouselSlide>
            );
          })}
        </CarouselContent>

        <CarouselDots className="py-6 lg:py-8 z-20" />
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
