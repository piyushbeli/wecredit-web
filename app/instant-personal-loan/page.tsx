/**
 * Instant Personal Loan Landing Page — standalone campaign page.
 * Server component composes section blocks; interactivity via PersonalLoanContent.
 */

import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/seo/build-page-metadata';
import { WEB_SEO_ROUTES } from '@/lib/seo/static-page-seo';
import PageStructuredData from '@/components/seo/page-structured-data';
import HeroSection from '@/components/instant-personal-loan/hero-section';
import InstantLoanStatsSection from '@/components/instant-personal-loan/stats-section';
import HowItWorksSection from '@/components/instant-personal-loan/how-it-works-section';
import WhyWeCreditSection from '@/components/instant-personal-loan/why-wecredit-section';
import EligibilitySection from '@/components/instant-personal-loan/eligibility-section';
import DocumentsSection from '@/components/instant-personal-loan/documents-section';
import RepaymentTermsSection from '@/components/instant-personal-loan/repayment-terms-section';
import PageFooter from '@/components/instant-personal-loan/page-footer';
import StickyCta from '@/components/instant-personal-loan/sticky-cta';
import { PersonalLoanContent } from '@/components/personal-loan/personal-loan-content';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata('/instant-personal-loan/');

const InstantPersonalLoanPage = (): React.ReactNode => {
  return (
    <div className="min-h-screen pb-28">
      <PageStructuredData path={WEB_SEO_ROUTES.INSTANT_PERSONAL_LOAN} breadcrumb product />
      <HeroSection />
      <InstantLoanStatsSection />
      <HowItWorksSection />
      <WhyWeCreditSection />
      <EligibilitySection />
      <DocumentsSection />
      <RepaymentTermsSection />
      <PageFooter />

      {/* Auth, dedupe, and lead-form modals */}
      <Suspense fallback={null}>
        <PersonalLoanContent />
      </Suspense>

      <StickyCta />
    </div>
  );
};

export default InstantPersonalLoanPage;
