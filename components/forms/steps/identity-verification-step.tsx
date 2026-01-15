/**
 * Identity Verification Step (Step 4)
 * Collects user's PAN information
 */

import InputField from '../input-field';

interface IdentityVerificationStepProps {
  pan: string;
  onPanChange: (value: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

const IdentityVerificationStep = ({
  pan,
  onPanChange,
  errors,
  disabled = false,
}: IdentityVerificationStepProps) => {
  return (
    <InputField
      label="Enter Your PAN Number"
      value={pan}
      onChange={onPanChange}
      error={errors.pan}
      disabled={disabled}
      placeholder="Enter Your PAN Number"
      required
    />
  );
};

export default IdentityVerificationStep;
