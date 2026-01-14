/**
 * Offers Page
 * Placeholder page displayed after successful lead creation
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Your Loan Offers | WeCredit',
  description: 'View your personalized loan offers from top lenders',
};

/**
 * Offers page component
 * Shows a success message after lead creation
 */
export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your application. Our team is reviewing your details
            and will get back to you shortly with the best loan offers.
          </p>
          {/* What's Next Section */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">1.</span>
                <span>Our team will verify your details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">2.</span>
                <span>You will receive personalized loan offers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">3.</span>
                <span>Choose the best offer and complete your application</span>
              </li>
            </ul>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                Back to Home
              </Button>
            </Link>
            <Link href="/contact-us" className="block">
              <Button variant="outline" className="w-full h-12 text-base">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
