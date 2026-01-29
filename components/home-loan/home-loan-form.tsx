'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Home, CheckCircle2 } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import HomeLoanFields from './home-loan-fields';
import { useHomeLoanForm } from './use-home-loan-form';
import { useRouter } from 'next/navigation';

interface HomeLoanFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back calls onClose */
  isModal?: boolean;
}

const HomeLoanForm = ({ onClose, isModal = false }: HomeLoanFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleSubmit,
    isSubmitting,
    showSuccess,
    canSubmit,
  } = useHomeLoanForm();
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

  // Success screen: full-screen replacement with illustration, message, and CTA.
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
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="rounded-full bg-blue-50 p-4">
                  <Home className="w-12 h-12 text-blue-600" />
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3">
                THANK YOU FOR SUBMITTING YOUR HOME LOAN REQUEST!
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
        <h1 className="text-base font-medium text-gray-900">Home Loan</h1>
      </div>

      <form onSubmit={onFormSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <HomeLoanFields
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

export default HomeLoanForm;
