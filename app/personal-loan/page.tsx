/**
 * Personal Loan Landing Page - Server Component
 * Comprehensive personal loan page with all sections
 * Interactive logic is in PersonalLoanContent client component
 */

import React from 'react';
import HeroSection from '@/components/personal-loan/hero-section';
import EmiCalculator from '@/components/personal-loan/emi-calculator';
import VideoSection from '@/components/personal-loan/video-section';
import HowToApplySteps from '@/components/personal-loan/how-to-apply-steps';
import DocumentsRequired from '@/components/personal-loan/documents-required';
import EligibilityCriteria from '@/components/personal-loan/eligibility-criteria';
import InterestRatesInfo from '@/components/personal-loan/interest-rates-info';
import WhyWeCredit from '@/components/personal-loan/why-wecredit';
import FeesAndChargesSection from '@/components/personal-loan/fees-charges-section';
import HowWeWorkSection from '@/components/personal-loan/how-we-work-section';
import BeforeApplyingSection from '@/components/personal-loan/before-applying-section';
import AfterClosureSection from '@/components/personal-loan/after-closure-section';
import ExpertQuoteSection from '@/components/personal-loan/expert-quote-section';
import { FaqSection } from '@/components/shared';
import { PersonalLoanContent } from '@/components/personal-loan/personal-loan-content';
import StickyApplyButton from '@/components/personal-loan/sticky-apply-button';
import TestimonialsSection from '@/components/home/testimonials-section';
import PartnersSection from '@/components/home/partners-section';
import { TrendingOffersClient } from '@/components/home';

/**
 * Personal Loan Page - Server Component
 * Renders all sections, delegates interactivity to PersonalLoanContent
 */
const PersonalLoanPage = (): React.ReactNode => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with gradient background */}
      <HeroSection />

      {/* EMI Calculator - Interactive */}
      <div className="px-4 pb-4 max-w-3xl mx-auto">
        <EmiCalculator title='Personal Loan Calculator' />
      </div>

      <TrendingOffersClient heading="Personal Loan Offers & Interest Rates" />

      {/* Video Section */}
      {/* <VideoSection /> */}

      {/* How to Apply Steps */}
      <HowToApplySteps />

      {/* Documents Required */}
      <DocumentsRequired />

      {/* Eligibility Criteria */}
      <EligibilityCriteria />

      {/* Interest Rates Info */}
      <InterestRatesInfo />

      {/* Why Choose WeCredit */}
      <WhyWeCredit />

      {/* Testimonials - Reused from home */}
      <TestimonialsSection />

      {/* Partners - Reused from home */}
      <PartnersSection />

      {/* Fees and Charges Table */}
      <FeesAndChargesSection />


      {/* How We Work Explanation */}
      <HowWeWorkSection />

      {/* Things to Know Before Applying */}
      <BeforeApplyingSection />


      {/* Things to Do After Loan Closure */}
      <AfterClosureSection />

      {/* Expert Quote / Testimonial */}
      <ExpertQuoteSection />

      {/* FAQ Section - Personal loan specific */}
      <FaqSection />

      {/* Client Component: Modal and Auth Flow Logic */}
      <PersonalLoanContent />

      {/* Sticky Apply Button - Fixed at bottom, visible during scrolling */}
      <StickyApplyButton />
    </div>
  );
};

export default PersonalLoanPage;
