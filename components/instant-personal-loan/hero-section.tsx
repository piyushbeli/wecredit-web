'use client';

/**
 * Hero section for the Instant Personal Loan landing page.
 * Gradient background, headline, illustration, benefit pills, and lead capture.
 */

import { JSX } from 'react';
import Image from 'next/image';
import { IndianRupee, Percent, Zap } from 'lucide-react';
import { IMAGES } from '@/lib/constants/images';
import { HERO_BENEFITS, HERO_HEADLINE, HERO_TAGLINE, type HeroBenefit } from './constants';
import LeadCaptureForm from './lead-capture-form';
import PageHeader from './page-header';

const BENEFIT_ICON_MAP = {
  rupee: IndianRupee,
  percent: Percent,
  lightning: Zap,
} as const;

interface BenefitPillProps {
  benefit: HeroBenefit;
}

const BenefitPill = ({ benefit }: BenefitPillProps): JSX.Element => {
  const Icon = BENEFIT_ICON_MAP[benefit.icon];

  return (
    <div className="flex flex-col items-center gap-1 bg-brand-primary/60 backdrop-blur-sm rounded-lg px-2 py-2 flex-1 min-w-0">
      <Icon className="w-9 h-9 text-white shrink-0 mb-2" aria-hidden />
      <span className="text-sm text-white text-center leading-tight font-medium">
        {benefit.label}
      </span>
    </div>
  );
};

const HeroSection = (): JSX.Element => {
  return (
    <section className="ipl-hero-gradient pt-16 pb-6">
      <PageHeader />
      <div className="px-4 max-w-xl mx-auto pt-4">
        {/* Tagline + headline with centered illustration */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-base text-white mb-1">{HERO_TAGLINE}</p>
            <h1 className="md:text-4xl text-3xl font-medium text-black leading-tight">
              {HERO_HEADLINE}
            </h1>
          </div>
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src={IMAGES.ICONS.IPL}
              alt="Personal loan illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Benefit pills */}
        <div className="flex gap-2 mb-6">
          {HERO_BENEFITS.map((benefit) => (
            <BenefitPill key={benefit.id} benefit={benefit} />
          ))}
        </div>

        {/* Lead capture */}
        <LeadCaptureForm />
      </div>
    </section>
  );
};

export default HeroSection;
