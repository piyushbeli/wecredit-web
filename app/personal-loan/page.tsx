/**
 * Personal Loan Landing Page - Server Component
 * Comprehensive personal loan page with all sections
 * Interactive logic is in PersonalLoanContent client component
 */

import { JSX } from 'react';
import HeroSection from '@/components/personal-loan/hero-section';
import EmiCalculator from '@/components/personal-loan/emi-calculator';
import VideoSection from '@/components/personal-loan/video-section';
import HowToApplySteps from '@/components/personal-loan/how-to-apply-steps';
import DocumentsRequired from '@/components/personal-loan/documents-required';
import EligibilityCriteria from '@/components/personal-loan/eligibility-criteria';
import InterestRatesInfo from '@/components/personal-loan/interest-rates-info';
import WhyWeCredit from '@/components/personal-loan/why-wecredit';
import PersonalLoanFaq from '@/components/personal-loan/personal-loan-faq';
import { PersonalLoanContent } from '@/components/personal-loan/personal-loan-content';
import TestimonialsSection from '@/components/home/testimonials-section';
import CertificationsSection from '@/components/home/certifications-section';
import PartnersSection from '@/components/home/partners-section';
import { TrendingOffersClient } from '@/components/home';

/**
 * Personal Loan Page - Server Component
 * Renders all sections, delegates interactivity to PersonalLoanContent
 */
const PersonalLoanPage = (): JSX.Element => {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section with gradient background */}
      <HeroSection />

      {/* EMI Calculator - Interactive */}
      <EmiCalculator />

      <TrendingOffersClient heading="Personal Loan Offers & Interest Rates" />

      {/* Video Section */}
      <VideoSection />

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
      <TestimonialsSection  />

      {/* Partners - Reused from home */}
      <PartnersSection />

      {/* FAQ Section - Personal loan specific */}
      {/* <PersonalLoanFaq /> */}

      {/* Client Component: CTA Button and Modal */}
      {/* <PersonalLoanContent /> */}
    </div>
  );
};

export default PersonalLoanPage;
