'use client';

import { LoanProductSplitLayout, type LoanFeatureItem } from '@/components/shared';
import GoldLoanFields from './gold-loan-fields';
import { useGoldLoanForm } from './use-gold-loan-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { GoldLoanFormProps } from './gold-loan-form.types';

const GOLD_LOAN_FEATURES: readonly LoanFeatureItem[] = [
  {
    title: 'Safe & Insured',
    description: 'Your gold stays protected',
    icon: 'zap',
  },
  {
    title: 'Fair Valuation',
    description: 'Maximum loan against your gold',
    icon: 'coins',
  },
  {
    title: 'Quick Approval',
    description: 'Apply today, get money fast',
    icon: 'calendar',
  },
];

const GoldLoanForm = ({
  onClose,
  isModal = false,
  onSuccess,
}: GoldLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    getValidatedPayload,
    isSubmitting,
    canSubmit,
  } = useGoldLoanForm({ onSuccess });
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
      // Use the mobile from the form to start OTP flow and skip the login
      // phone entry bottom sheet. Payload is stored for post-login submit.
      void openAuthModalWithPhoneAndAction(payload.mobile, {
        type: 'submit_gold_loan',
        goldLoanPayload: payload,
      });
      return;
    }
    handleSubmit();
  };

  return (
    <LoanProductSplitLayout
      isModal={isModal}
      accent="gold"
      title="Gold Loan"
      headline="Let your gold support your financial needs."
      subheadline="Rates from 8.75% p.a., tenures up to 7 years, and approval in minutes — all online."
      formTitle="Turn Your Gold into Financial Support"
      hero={{
        src: '/assets/images/gold-loan.png',
        alt: 'Stack of gold bars',
        width: 683,
        height: 283,
        size: 'large',
        className: 'mix-blend-screen',
      }}
      features={GOLD_LOAN_FEATURES}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onBack={handleBack}
      onSubmit={onFormSubmit}
    >
      <GoldLoanFields
        formValues={formValues}
        formErrors={formErrors}
        handleFieldChange={handleFieldChange}
        handleFieldBlur={handleFieldBlur}
      />
    </LoanProductSplitLayout>
  );
};

export default GoldLoanForm;
