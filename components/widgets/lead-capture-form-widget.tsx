'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { LeadCaptureFormWidget } from '@/types/strapi';

/** Props for LeadCaptureFormWidget component */
interface LeadCaptureFormWidgetProps {
  widget: LeadCaptureFormWidget;
}

/**
 * Validates if a phone number is a valid 10-digit Indian mobile number
 */
const isValidMobileNumber = (value: string): boolean => {
  const numericValue = value.replace(/\D/g, '');
  return numericValue.length === 10 && /^\d{10}$/.test(numericValue);
};

/**
 * Renders a lead capture form widget with mobile number input
 * Validates Indian mobile numbers and redirects to specified URL on submission
 */
const LeadCaptureFormWidget = ({ widget }: LeadCaptureFormWidgetProps) => {
  const {
    title,
    highlightedAmount,
    countryCode,
    placeholder,
    buttonText,
    redirectUrl,
    termsText,
    termsLinkText,
    termsUrl,
    brandName,
  } = widget;

  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);

  /**
   * Handles mobile number input change
   * Allows only numeric characters and limits to 10 digits
   */
  const handleMobileNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobileNumber(value);
    }
  };

  /**
   * Handles checkbox change for terms acceptance
   */
  const handleTermsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTermsAccepted(event.target.checked);
  };

  /**
   * Handles form submission
   * Validates inputs and redirects to the specified URL with mobile number
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!mobileNumber) {
      alert('Please enter your mobile number');
      return;
    }

    if (!isValidMobileNumber(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!isTermsAccepted) {
      alert(`Please accept ${termsLinkText || 'Terms & Policy'}`);
      return;
    }

    const url = redirectUrl+`?mn=${mobileNumber}`;
    window.location.href = url;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title and Highlighted Amount */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-blue-600">{highlightedAmount}</p>
        </div>

        {/* Mobile Number Input */}
        <div className="flex gap-2">
          <div className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700">
            {countryCode}
          </div>
          <input
            type="tel"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
          />
        </div>

        {/* Terms and Policy Checkbox */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isTermsAccepted}
            onChange={handleTermsChange}
            className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            {termsText}{' '}
            {termsUrl ? (
              <a
                href={termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {termsLinkText}
              </a>
            ) : (
              <span className="text-gray-900 font-medium">{termsLinkText}</span>
            )}
            {brandName && ` of ${brandName}`}.
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default LeadCaptureFormWidget;
