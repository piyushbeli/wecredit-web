'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Country code configuration */
interface CountryCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

/** Available country codes */
const countryCodes: CountryCode[] = [
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'UAE' },
];

/** Props for PhoneInput component */
interface PhoneInputProps {
  /** Current phone number value */
  value: string;
  /** Callback when phone number changes */
  onChange: (value: string, isValid: boolean) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Phone number input with country code selector and validation
 */
const PhoneInput = ({
  value,
  onChange,
  placeholder = '',
  error,
  className,
}: PhoneInputProps): React.ReactNode => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  /** Validate phone number based on country */
  const validatePhone = useCallback(
    (phone: string): boolean => {
      const digitsOnly = phone.replace(/\D/g, '');
      if (selectedCountry.code === 'IN') {
        return digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly);
      }
      return digitsOnly.length >= 10;
    },
    [selectedCountry]
  );

  /** Handle phone number input change */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 10);
    const isValid = validatePhone(digitsOnly);
    onChange(digitsOnly, isValid);
  };

  /** Handle country selection */
  const handleCountrySelect = (country: CountryCode): void => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    const isValid = validatePhone(value);
    onChange(value, isValid);
  };

  const hasError = error && value.length > 0;
  const isValid = validatePhone(value) && value.length > 0;

  return (
    <div className={cn('relative', className)}>
      {/* Input Container */}
      <div
        className={cn(
          'flex items-center border-b-2 transition-colors',
          isFocused ? 'border-wc-blue-500' : 'border-gray-200',
          hasError && 'border-red-500'
        )}
      >
        {/* Country Code Selector */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 py-3 pr-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className="text-xl">🇮🇳
          </span>
          <span className="text-sm font-medium">+91</span>
          
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mr-3" />

        {/* Phone Input */}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={'Enter your phone number'}
          className="flex-1 py-3 text-gray-900 text-base outline-none placeholder:text-gray-400"
          maxLength={10}
          inputMode="numeric"
          autoComplete="tel"
        />

      </div>

      {/* Country Dropdown */}
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20"
        >
          {countryCodes.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountrySelect(country)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors',
                selectedCountry.code === country.code && 'bg-wc-blue-50'
              )}
            >
              <span className="text-xl">{country.flag}</span>
              <span className="flex-1 text-left text-sm text-gray-900">{country.name}</span>
              <span className="text-sm text-gray-500">{country.dialCode}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default PhoneInput;

