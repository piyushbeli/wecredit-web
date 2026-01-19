/**
 * Personal Information Step (Step 1)
 * Collects user's basic personal details
 */

import InputField from '../input-field';
import ButtonGroup from '../button-group';

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  mobile: string;
  dob: string;
  email: string;
  gender: string;
  maritalStatus: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onDobChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onMaritalStatusChange: (value: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

const PersonalInfoStep = ({
  firstName,
  lastName,
  mobile,
  dob,
  email,
  gender,
  maritalStatus,
  onFirstNameChange,
  onLastNameChange,
  onMobileChange,
  onDobChange,
  onEmailChange,
  onGenderChange,
  onMaritalStatusChange,
  errors,
  disabled = false,
}: PersonalInfoStepProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="First Name"
          value={firstName}
          onChange={onFirstNameChange}
          error={errors.firstName}
          disabled={disabled}
          placeholder="First Name"
          helperText="As per PAN card"
          required
        />
        <InputField
          label="Last Name"
          value={lastName}
          onChange={onLastNameChange}
          error={errors.lastName}
          disabled={disabled}
          placeholder="Last Name"
          helperText="As per PAN card"
          required
        />
      </div>

      <InputField
        label="Phone Number"
        value={mobile}
        onChange={onMobileChange}
        error={errors.mobile}
        disabled={disabled}
        placeholder="Phone Number"
        inputMode="tel"
        required
      />

      <InputField
        label="Date of Birth"
        value={dob}
        onChange={onDobChange}
        error={errors.dob}
        disabled={disabled}
        placeholder="DD-MM-YYYY"
        inputMode="numeric"
        required
      />

      <InputField
        label="Personal Email ID"
        value={email}
        onChange={onEmailChange}
        error={errors.email}
        disabled={disabled}
        placeholder="Personal Email ID"
        type="email"
        inputMode="email"
        required
      />

      <div>
        <label className="lead-form-label">
          Gender <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          value={gender}
          onChange={onGenderChange}
          disabled={disabled}
          error={errors.gender}
        />
      </div>

      <div>
        <label className="lead-form-label">
          Marital Status <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={[
            { value: 'married', label: 'Married' },
            { value: 'single', label: 'Unmarried' },
          ]}
          value={maritalStatus}
          onChange={onMaritalStatusChange}
          disabled={disabled}
          error={errors.maritalStatus}
        />
      </div>
    </>
  );
};

export default PersonalInfoStep;
