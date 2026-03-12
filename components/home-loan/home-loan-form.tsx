'use client';

import { ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/shared';
import HomeLoanFields from './home-loan-fields';
import { useHomeLoanForm } from './use-home-loan-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface HomeLoanFormProps {
  onClose?: () => void;
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 and back calls onClose */
  isModal?: boolean;
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

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
        <h1 className="text-base font-medium text-gray-900">Home Loan</h1>
      </div>

      <form onSubmit={onFormSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
            <HomeLoanFields
              formValues={formValues}
              formErrors={formErrors}
              handleFieldChange={handleFieldChange}
              handleFieldBlur={handleFieldBlur}
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
