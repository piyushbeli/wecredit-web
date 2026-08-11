'use client';

import { LoanProductSplitLayout } from '@/components/shared';
import CarLoanFields from './car-loan-fields';
import { useCarLoanForm } from './use-car-loan-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { CarLoanFormProps } from './car-loan-form.types';

const CarLoanForm = ({
  onClose,
  isModal = false,
  onSuccess,
}: CarLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    getValidatedPayload,
    isSubmitting,
    canSubmit,
  } = useCarLoanForm({ onSuccess });
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
      // User has already entered phone in the form; use it for OTP and skip
      // the login bottom sheet (phone input screen). Payload is stored for post-login submit.
      void openAuthModalWithPhoneAndAction(payload.mobile, {
        type: 'submit_car_loan',
        carLoanPayload: payload,
      });
      return;
    }
    handleSubmit();
  };

  return (
    <LoanProductSplitLayout
      isModal={isModal}
      title="Car Loan"
      headline="Drive home your dream car this month"
      subheadline="Rates from 8.75% p.a., tenures up to 7 years, and approval in minutes — all online."
      formTitle="Start Your financial journey"
      hero={{
        src: '/assets/images/car-loan-hero.svg',
        alt: 'White sedan car',
        width: 681,
        height: 224,
        size: 'large',
      }}
      bannerPattern="perspective"
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onBack={handleBack}
      onSubmit={onFormSubmit}
    >
      <CarLoanFields
        formValues={formValues}
        formErrors={formErrors}
        handleFieldChange={handleFieldChange}
        handleFieldBlur={handleFieldBlur}
      />
    </LoanProductSplitLayout>
  );
};

export default CarLoanForm;
