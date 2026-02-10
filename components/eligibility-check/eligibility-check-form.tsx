'use client';

import { ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import EligibilityCheckFields from './eligibility-check-fields';
import { useEligibilityCheckForm } from './use-eligibility-check-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface EligibilityCheckFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back calls onClose */
  isModal?: boolean;
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

const EligibilityCheckForm = ({
  onClose,
  isModal = false,
  onSuccess,
}: EligibilityCheckFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleSubmit,
    isSubmitting,
    canSubmit,
  } = useEligibilityCheckForm({ onSuccess });
  const router = useRouter();
  const { isAuthenticated, openAuthModalWithPhone } = useAuth();

  const handleHeaderBackClick = (): void => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Use the eligibility form's phone number for OTP and skip the
      // separate login phone bottom sheet.
      void openAuthModalWithPhone(formValues.phoneNumber);
      return;
    }
    handleSubmit();
  };

  const rootClassName = isModal
    ? 'flex flex-col flex-1 min-h-0 bg-white'
    : 'bg-white h-screen flex flex-col';

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
        <h1 className="text-base font-medium text-gray-900">
          Fill your details to get Credit Report
        </h1>
      </div>

      <form onSubmit={onFormSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <EligibilityCheckFields
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

export default EligibilityCheckForm;
