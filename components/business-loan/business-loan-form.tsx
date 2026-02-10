'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import BusinessLoanFields from './business-loan-fields';
import { useBusinessLoanForm } from './use-business-loan-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface BusinessLoanFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back on step 1 calls onClose */
  isModal?: boolean;
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

const BusinessLoanForm = ({ onClose, isModal = false, onSuccess }: BusinessLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleNext,
    handleBack,
    handleSubmit,
    currentStep,
    totalSteps,
    currentStepConfig,
    isFirstStep,
    isLastStep,
    isSubmitting,
    canSubmit,
  } = useBusinessLoanForm({ onSuccess });
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithPhone } = useAuth();

  const handleHeaderBackClick = (): void => {
    if (isFirstStep) {
      if (onClose) {
        onClose();
      } else {
        router.push('/');
      }
      return;
    }
    handleBack();
  };

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Business loan currently relies on auth for a trusted mobile; if the
      // form ever includes an editable mobile field, we will use it here.
      // For now this safely falls back to the standard auth modal when the
      // mobile value is not a valid 10-digit number.
      void openAuthModalWithPhone(formValues.mobile);
      return;
    }
    handleSubmit();
  };

  const renderFooterButton = (): React.ReactNode => {
    if (!isLastStep) {
      return (
        <ActionButton type="button" onClick={handleNext} fullWidth className="h-14 text-base">
          Next
        </ActionButton>
      );
    }
    return (
      <ActionButton
        type="submit"
        disabled={!canSubmit}
        isLoading={isSubmitting}
        fullWidth
        className="h-14 text-base"
      >
        Submit
      </ActionButton>
    );
  };

  const rootClassName = isModal
    ? 'flex flex-col flex-1 min-h-0 bg-white'
    : 'bg-white h-screen flex flex-col';

  return (
    <div className={rootClassName}>
      {/* Step header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleHeaderBackClick}
          className="p-1 text-gray-700 hover:text-gray-900"
          aria-label={isFirstStep ? 'Back' : 'Previous step'}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base font-medium text-gray-900">
          Business Loan ({currentStep}/{totalSteps})
        </h1>
      </div>

      <form onSubmit={onFormSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <h2 className="lead-form-heading">{currentStepConfig.title}</h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <BusinessLoanFields
                  stepNumber={currentStep}
                  formValues={formValues}
                  formErrors={formErrors}
                  handleFieldChange={handleFieldChange}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer button */}
        <div className="border-t bg-white p-4 shrink-0">{renderFooterButton()}</div>
      </form>
    </div>
  );
};

export default BusinessLoanForm;
