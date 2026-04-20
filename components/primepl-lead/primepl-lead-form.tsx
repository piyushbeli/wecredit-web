'use client';

import { ActionButton } from '@/components/shared';
import PrimeplLeadFields from './primepl-lead-fields';
import { PrimeplLeadFormHeading } from './primepl-lead-form-heading';
import { BasicWeCreditHeader } from './BasicWeCreditHeader';
import { usePrimeplLeadForm } from './use-primepl-lead-form';
import { useAuth } from '@/hooks/use-auth';

interface PrimeplLeadFormProps {
  /** When true, form is embedded in modal; root uses flex-1 min-h-0 */
  isModal?: boolean;
  /** Called when the API submit succeeds so the parent can show success state. */
  onSuccess?: () => void;
}

const PrimeplLeadForm = ({
  isModal = false,
  onSuccess,
}: PrimeplLeadFormProps): React.ReactNode => {
  const {
    formValues,
    formErrors,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    getValidatedPayload,
    isSubmitting,
    canSubmit,
  } = usePrimeplLeadForm({ onSuccess });
  const { isAuthenticated, openAuthModalWithPhoneAndAction } = useAuth();

  const onFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isAuthenticated) {
      const payload = getValidatedPayload();
      if (!payload) return;
      void openAuthModalWithPhoneAndAction(payload.phoneNumber, {
        type: 'submit_primepl_lead',
        primeplLeadPayload: payload,
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
      <BasicWeCreditHeader />

      <form onSubmit={onFormSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
            <PrimeplLeadFormHeading />
            <PrimeplLeadFields
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

export default PrimeplLeadForm;
