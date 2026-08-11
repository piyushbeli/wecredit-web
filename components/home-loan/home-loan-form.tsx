'use client';

import { LoanProductSplitLayout } from '@/components/shared';
import HomeLoanFields from './home-loan-fields';
import { useHomeLoanForm } from './use-home-loan-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { HomeLoanFormProps } from './home-loan-form.types';

const HomeLoanForm = ({
  onClose,
  isModal = false,
  onSuccess,
}: HomeLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    getValidatedPayload,
    isSubmitting,
    canSubmit,
  } = useHomeLoanForm({ onSuccess });
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithPhoneAndAction } = useAuth();

  const handleBack = (): void => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const onFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!isAuthenticated) {
      const payload = getValidatedPayload();
      // Validation errors are already surfaced by the hook; avoid opening OTP if invalid.
      if (!payload) return;
      // Start OTP using the mobile captured in the form and skip the login
      // phone input bottom sheet. Payload is stored for post-login submit.
      void openAuthModalWithPhoneAndAction(payload.mobile, {
        type: 'submit_home_loan',
        homeLoanPayload: payload,
      });
      return;
    }
    handleSubmit();
  };

  return (
    <LoanProductSplitLayout
      isModal={isModal}
      title="Home Loan"
      headline="Your dream home is closer than you think"
      subheadline="Rates from 8.75% p.a., tenures up to 7 years, and approval in minutes — all online."
      formTitle="Take a step towards your Dream Home"
      hero={{
        src: '/assets/images/home-loan.png',
        alt: 'House on a cloud',
        width: 521,
        height: 521,
        className: 'mix-blend-screen',
      }}
      bannerPatternSrc="/assets/images/home-loan-banner-pattern.png"
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onBack={handleBack}
      onSubmit={onFormSubmit}
    >
      <HomeLoanFields
        formValues={formValues}
        formErrors={formErrors}
        handleFieldChange={handleFieldChange}
        handleFieldBlur={handleFieldBlur}
      />
    </LoanProductSplitLayout>
  );
};

export default HomeLoanForm;
