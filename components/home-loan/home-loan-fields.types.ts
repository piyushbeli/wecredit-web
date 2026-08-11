import type { HomeLoanFormState } from './home-loan-form.config';

export interface HomeLoanFieldsProps {
  formValues: HomeLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof HomeLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof HomeLoanFormState) => void;
}
