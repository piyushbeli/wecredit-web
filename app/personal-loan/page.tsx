/**
 * Personal Loan Landing Page - Server Component
 * Showcases personal loan offerings with static content
 * Interactive logic is in PersonalLoanContent client component
 */

import { cn } from '@/lib/utils';
import { PersonalLoanContent } from '@/components/personal-loan/personal-loan-content';

/** Benefit card data */
const BENEFITS = [
  {
    icon: '/icons/loan-amount.svg',
    title: 'Upto ₹15 lakhs',
    fallbackIcon: '💰',
  },
  {
    icon: '/icons/interest-rate.svg',
    title: 'Interest from 9.9%',
    fallbackIcon: '📊',
  },
  {
    icon: '/icons/disbursal.svg',
    title: 'Disbursal in 5 min',
    fallbackIcon: '⏱️',
  },
];

/** Partner/Lender logos */
const PARTNER_LOGOS = [
  { name: 'mPokket', logo: '/logos/mpokket.png' },
  { name: 'Olyv', logo: '/logos/olyv.png' },
  { name: 'Poonawalla', logo: '/logos/poonawalla.png' },
  { name: 'Prefr', logo: '/logos/prefr.png' },
  { name: 'Protium', logo: '/logos/protium.png' },
  { name: 'Ramfin', logo: '/logos/ramfin.png' },
];

/** Steps data */
const STEPS = [
  {
    number: 1,
    title: 'Apply and Verify:',
    description: 'Fill the form, then verify your mobile number with the OTP.',
    isCompleted: true,
  },
  {
    number: 2,
    title: 'Fill Details and View Offers:',
    description: 'Enter your personal, and income details, agree to the terms, and click "See All Offers" to view eligible lenders.',
    isCompleted: true,
  },
  {
    number: 3,
    title: 'Choose Lender & Get Disbursal:',
    description: 'Select your preferred lender, complete their process, and get money in your account.',
    isCompleted: false,
  },
];

/**
 * Personal Loan Page - Server Component
 * Renders static content, delegates interactivity to PersonalLoanContent
 */
export default function PersonalLoanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      {/* Hero Section */}
      <section className="bg-white px-4 pt-6 pb-8">
        <p className="text-gray-600 text-sm mb-1">Loans for every Credit Profile.</p>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Get Instant Personal Loans.
        </h1>

        {/* Benefits Cards */}
        <div className="flex justify-between gap-2">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center text-center p-3"
            >
              <div className="w-16 h-16 mb-2 flex items-center justify-center bg-blue-50 rounded-full">
                <span className="text-3xl">{benefit.fallbackIcon}</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">{benefit.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white mx-4 my-4 rounded-xl shadow-sm">
        <div className="flex divide-x divide-gray-200">
          <div className="flex-1 py-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Loan Disbursed</p>
            <p className="text-lg font-bold text-gray-900">₹650 Crore</p>
          </div>
          <div className="flex-1 py-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Trusted by</p>
            <p className="text-lg font-bold text-gray-900">4 lakh + Indians</p>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="bg-white mx-4 mb-4 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
          {PARTNER_LOGOS.map((partner, index) => (
            <div
              key={index}
              className="shrink-0 h-8 px-3 flex items-center justify-center bg-gray-50 rounded-lg"
            >
              <span className="text-xs font-medium text-gray-600">{partner.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-white mx-4 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
          Get your <span className="text-blue-600">loan</span> in 3 easy steps
        </h2>

        <div className="space-y-6">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'border-2',
                    step.isCompleted
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  )}
                >
                  {step.isCompleted ? (
                    <StepIcon />
                  ) : (
                    <span className="text-sm font-semibold text-gray-500">
                      {step.number}
                    </span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  {step.isCompleted && (
                    <div className="shrink-0 ml-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckIcon />
                      </div>
                      <p className="text-xs text-green-600 mt-1">Step completed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Component: CTA Button and Modal */}
      <PersonalLoanContent />
    </div>
  );
}

/** Step icon component */
function StepIcon() {
  return (
    <svg
      className="w-5 h-5 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

/** Check icon component */
function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
