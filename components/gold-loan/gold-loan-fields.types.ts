import type { GoldLoanFormState } from './gold-loan-form.config';

export interface GoldLoanFieldsProps {
  formValues: GoldLoanFormState;
  formErrors: Record<string, string>;
  handleFieldChange: (key: keyof GoldLoanFormState, value: string | boolean) => void;
  handleFieldBlur: (key: keyof GoldLoanFormState) => void;
}
