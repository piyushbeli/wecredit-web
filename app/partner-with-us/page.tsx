'use client';

import React, { useState, FormEvent, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageBanner from '@/components/shared/page-banner';
import { IMAGES } from '@/lib/constants/images';
import InputField from '@/components/forms/input-field';
import Image from 'next/image';
import { ActionButton } from '@/components/shared';
import { partnerWithUs } from '@/lib/api/partner-service';
import { useAuth } from '@/hooks/use-auth';
import { BackToHomeButton } from '@/components/shared/back-to-home-button'; 
/**
 * Partner with Us page component
 * Displays a form for partnership inquiries
 */
const PartnerWithUsPage = (): React.ReactNode => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const wasAuthenticated = useRef<boolean>(isAuthenticated);
  const pendingSubmission = useRef<boolean>(false);

  /**
   * Filters phone number input to only allow digits and limits to 10 characters
   * Prevents non-numeric characters from being entered
   */
  const handlePhoneNumberChange = (value: string): void => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      handleChange('phoneNumber', digitsOnly);
    }
  };

  /**
   * Handles input field changes and clears associated error when user starts typing
   * This provides immediate feedback by removing error messages as user corrects input
   */
  const handleChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing to provide immediate feedback
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validates all form fields and sets error messages
   * Returns true if form is valid, false otherwise
   * Handles edge cases: empty strings, invalid email format, invalid phone format
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate full name - required field
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Validate email - required and must match email pattern
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone number - required and must be exactly 10 digits
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(phoneDigits)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Validate message - required field
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Performs the actual API submission
   * Separated to avoid dependency issues in useEffect
   */
  const performSubmission = useCallback(async (): Promise<void> => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call API with form data
      // API function handles trimming and phone number conversion
      const success = await partnerWithUs({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        message: formData.message,
      });

      if (success) {
        // Show success state on successful submission
        setShowSuccess(true);
        
        // Reset form data (but keep success state visible for user feedback)
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          message: '',
        });
        setErrors({});
        pendingSubmission.current = false;
      }
      // If false, error toast is already shown by API function
      // Keep form visible so user can retry
    } catch (error) {
      // Handle unexpected errors (shouldn't happen as API function catches all)
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting]);

  /**
   * Handles form submission logic
   * Validates form, checks authentication, shows loading state, calls API, then shows success state on success
   * Handles race conditions by checking validation before submission
   * Resets form data after successful submission but keeps success state visible
   * Errors are shown via toast notifications from the API function
   * For non-logged-in users, opens login modal and stores pending submission
   */
  const submitForm = async (): Promise<void> => {
    // Early return if validation fails
    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    // If not, open login modal and mark submission as pending
    if (!isAuthenticated) {
      pendingSubmission.current = true;
      openAuthModal();
      return;
    }

    await performSubmission();
  };

  /**
   * Watch for authentication state change (user just completed login)
   * Clears pending submission flag when user logs in
   * User must click submit button again to submit the form
   */
  useEffect(() => {
    const justAuthenticated = isAuthenticated && !wasAuthenticated.current;
    
    // If user just logged in and there was a pending submission, clear the flag
    // User will need to click submit button again to proceed
    if (justAuthenticated && pendingSubmission.current) {
      pendingSubmission.current = false;
    }
    
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  /**
   * Handles form submission from form element (e.g., Enter key press)
   * Prevents default form submission behavior
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await submitForm();
  };

  /**
   * Handles submit button click
   * Wraps submitForm in error handling to prevent unhandled promise rejections
   */
  const handleSubmitClick = (): void => {
    submitForm().catch((error) => {
      // Log error for debugging, but don't show noisy console logs
      setIsSubmitting(false);
    });
  };

  /**
   * Handles navigation to homepage after successful submission
   */
  const handleContinueToHomepage = (): void => {
    router.push('/');
  };

  /**
   * Get textarea className based on error state
   * Separates conditional logic from JSX for better readability
   */
  const getTextareaClassName = (): string => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg border text-base transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    return errors.message
      ? `${baseClasses} border-red-300 bg-red-50`
      : `${baseClasses} border-gray-300 bg-white`;
  };

  // Early return for success state - cleaner than nested ternary
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        {/* Message Section - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <Image src={IMAGES.ICONS.PWS_SUCCESS} alt="Partner with Us Success Icon" width={100} height={100} />
          
          {/* Thank You Message */}
          <div className="space-y-3 max-w-md">
            <h2 className="text-base font-medium text-brand-primary uppercase">
              THANK YOU FOR REACHING OUT!
            </h2>
            <p className="text-gray-500 text-sm font-normal">
              We&apos;ve received your details and our team will connect with you shortly.
            </p>
          </div>
        </div>

        {/* Sticky Button at Bottom */}
        <div className="sticky bottom-0 w-full px-4 pb-4 pt-4 bg-white border-t border-gray-200">
          <ActionButton
            onClick={handleContinueToHomepage}
            className="w-full h-14 text-base font-medium"
            fullWidth
          >
            Continue to Homepage
          </ActionButton>
        </div>
      </div>
    );
  }

  // Form state - render form layout
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-28">
       <BackToHomeButton />  
          {/* Page Banner */}
          <div className="mb-8 flex justify-center">
            <PageBanner 
              title="PARTNER WITH US" 
              iconImage={IMAGES.ICONS.PARTNER_WITH_US}
              iconAlt="Partner with Us Icon"
            />
          </div>

          {/* Partner Form */}
          <div className="w-full pb-24">
            <form onSubmit={handleSubmit} className="space-y-4" id="partner-form">
              {/* Full Name */}
              <InputField
                label="Full Name"
                value={formData.fullName}
                onChange={(value) => handleChange('fullName', value)}
                placeholder="Full Name"
                error={errors.fullName}
                required
              />

              {/* Email ID */}
              <InputField
                label="Email ID"
                type="email"
                inputMode="email"
                value={formData.email}
                onChange={(value) => handleChange('email', value)}
                placeholder="Enter Your Email ID"
                error={errors.email}
                required
              />

              {/* Phone Number */}
              <InputField
                label="Phone Number"
                type="tel"
                inputMode="tel"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter Your Phone Number"
                error={errors.phoneNumber}
                maxLength={10}
                required
              />

              {/* Message */}
              <div className="space-y-2">
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Add Your Message..."
                  rows={5}
                  className={getTextareaClassName()}
                />
                {errors.message && (
                  <p className="text-xs text-red-600">{errors.message}</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Sticky Submit Button at Bottom */}
      <div className="sticky bottom-0 w-full px-4 pb-4 pt-4 bg-white border-t border-gray-200 shadow-sm">
        <ActionButton
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full h-14 text-base font-medium"
          fullWidth
        >
          Submit
        </ActionButton>
      </div>
    </div>
  );
};

export default PartnerWithUsPage;
