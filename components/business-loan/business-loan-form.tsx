'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import BusinessLoanFields from './business-loan-fields';
import { useBusinessLoanForm } from './use-business-loan-form';

const BusinessLoanForm = (): React.ReactNode => {
  const {
    formik,
    isSubmitting,
    showSuccess,
    canSubmit,
    getFieldError,
    currentStep,
    totalSteps,
    currentStepConfig,
    handleNext,
    handleBack,
    isFirstStep,
    isLastStep,
  } = useBusinessLoanForm();

  const successNotice = showSuccess ? (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      Your details have been submitted successfully. Our team will connect with you shortly.
    </div>
  ) : null;

  const handleHeaderBackClick = (): void => {
    if (isFirstStep) {
      // Standalone page: no-op or could navigate away if desired.
      return;
    }
    handleBack();
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

  return (
    <div className="bg-white min-h-screen flex flex-col">
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

      <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 min-h-0">
        {successNotice}

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
                  formik={formik}
                  getFieldError={getFieldError}
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
