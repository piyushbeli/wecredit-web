'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import CarLoanFields from './car-loan-fields';
import { useCarLoanForm } from './use-car-loan-form';
import { useRouter } from 'next/navigation';

interface CarLoanFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back calls onClose */
  isModal?: boolean;
}

const CarLoanForm = ({ onClose, isModal = false }: CarLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleSubmit,
    isSubmitting,
    showSuccess,
    canSubmit,
  } = useCarLoanForm();
  const router = useRouter();

  const handleHeaderBackClick = (): void => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleContinueToHomepage = (): void => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    handleSubmit();
  };

  const rootClassName = isModal
    ? 'flex flex-col flex-1 min-h-0 bg-white'
    : 'bg-white h-screen flex flex-col';

  if (showSuccess) {
    return (
      <div className={rootClassName}>
        <AnimatePresence>
          <motion.div
            className="flex flex-col flex-1 min-h-0 items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center text-center max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CheckCircle2 className="w-14 h-14 text-green-500 mb-6" />
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3">
                THANK YOU FOR SUBMITTING YOUR CAR LOAN REQUEST!
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                We&apos;ll get in touch with you shortly to guide you through the next steps.
              </p>
              <ActionButton
                type="button"
                onClick={handleContinueToHomepage}
                fullWidth
                className="h-14 text-base"
              >
                Continue to Homepage
              </ActionButton>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleHeaderBackClick}
          className="p-1 text-gray-700 hover:text-gray-900"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base font-medium text-gray-900">Car Loan</h1>
      </div>

      <form onSubmit={onFormSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <CarLoanFields
              formValues={formValues}
              formErrors={formErrors}
              handleFieldChange={handleFieldChange}
            />
          </div>
        </div>

        <div className="border-t bg-white p-4 shrink-0">
          <ActionButton
            type="submit"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            fullWidth
            className="h-14 text-base"
          >
            Submit
          </ActionButton>
        </div>
      </form>
    </div>
  );
};

export default CarLoanForm;
