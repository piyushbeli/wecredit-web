'use client';

import ButtonGroup from './button-group';

interface CreditCardSectionProps {
  isCreditCard: string | undefined;
  creditCardLimit: string;
  onFieldChange: (key: 'isCreditCard' | 'creditCardLimit', value: string) => void;
  disabled?: boolean;
}

const CreditCardSection = ({
  isCreditCard,
  creditCardLimit,
  onFieldChange,
  disabled = false,
}: CreditCardSectionProps) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <p className="lead-form-label" id="credit-card-question-label">
          Do you have a credit card?
        </p>
        <div role="group" aria-labelledby="credit-card-question-label">
          <ButtonGroup
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
            value={isCreditCard ?? ''}
            onChange={(value) => {
              onFieldChange('isCreditCard', value);
              // Clear stale limit value when user chooses "No" to keep form state consistent.
              if (value === 'false') {
                onFieldChange('creditCardLimit', '');
              }
            }}
            disabled={disabled}
            className="gap-3"
            buttonClassName="py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
        </div>
      </div>

      {isCreditCard === 'true' && (
        <div className="space-y-2">
          <label htmlFor="creditCardLimit" className="lead-form-label">
            What is the maximum limit on your credit card?
          </label>
          <input
            id="creditCardLimit"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={creditCardLimit}
            onChange={(e) => onFieldChange('creditCardLimit', e.target.value)}
            disabled={disabled}
            placeholder="Enter amount in rupees"
            className="w-full px-4 py-3 rounded-lg border text-base border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );
};

export default CreditCardSection;
