/**
 * Employment & Income Step (Step 3)
 * Collects user's employment and income details
 */

import InputField from '../input-field';
import ButtonGroup from '../button-group';

interface EmploymentInfoStepProps {
  employmentType: string;
  salary: string;
  companyAddress: string;
  companyPincode: string;
  onEmploymentTypeChange: (value: string) => void;
  onSalaryChange: (value: string) => void;
  onCompanyAddressChange: (value: string) => void;
  onCompanyPincodeChange: (value: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

const EmploymentInfoStep = ({
  employmentType,
  salary,
  companyAddress,
  companyPincode,
  onEmploymentTypeChange,
  onSalaryChange,
  onCompanyAddressChange,
  onCompanyPincodeChange,
  errors,
  disabled = false,
}: EmploymentInfoStepProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Employment Type <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={[
            { value: 'salaried', label: 'Salaried' },
            { value: 'selfEmployed', label: 'Self-employed' },
          ]}
          value={employmentType}
          onChange={onEmploymentTypeChange}
          disabled={disabled}
          error={errors.employmentType}
        />
      </div>

      <InputField
        label="Monthly Income"
        value={salary}
        onChange={onSalaryChange}
        error={errors.salary}
        disabled={disabled}
        placeholder="Monthly Income"
        inputMode="numeric"
        required
      />

      <InputField
        label="Company Address"
        value={companyAddress}
        onChange={onCompanyAddressChange}
        error={errors.companyAddress}
        disabled={disabled}
        placeholder="Company Address"
      />

      <InputField
        label="Company Pincode"
        value={companyPincode}
        onChange={onCompanyPincodeChange}
        error={errors.companyPincode}
        disabled={disabled}
        placeholder="Company Pincode"
        inputMode="numeric"
      />
    </>
  );
};

export default EmploymentInfoStep;
