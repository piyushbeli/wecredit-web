/**
 * Address Information Step (Step 2)
 * Collects user's address details
 */

import InputField from '../input-field';
import ButtonGroup from '../button-group';

interface AddressInfoStepProps {
  addressType: string;
  address: string;
  pincode: string;
  onAddressTypeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPincodeChange: (value: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

const AddressInfoStep = ({
  addressType,
  address,
  pincode,
  onAddressTypeChange,
  onAddressChange,
  onPincodeChange,
  errors,
  disabled = false,
}: AddressInfoStepProps) => {
  return (
    <>
      <div>
        <label className="lead-form-label">
          Address Information <span className="text-red-500">*</span>
        </label>
        <ButtonGroup
          options={[
            { value: 'current', label: 'Current' },
            { value: 'permanent', label: 'Permanent' },
          ]}
          value={addressType}
          onChange={onAddressTypeChange}
          disabled={disabled}
          error={errors.addressType}
        />
      </div>

      <InputField
        label="Address"
        value={address}
        onChange={onAddressChange}
        error={errors.permanentAddress}
        disabled={disabled}
        placeholder="Address"
        required
      />

      <InputField
        label="Enter Your Pincode"
        value={pincode}
        onChange={onPincodeChange}
        error={errors.pincode}
        disabled={disabled}
        placeholder="Enter Your Pincode"
        helperText="As per PAN card"
        inputMode="numeric"
        required
      />
    </>
  );
};

export default AddressInfoStep;
