/**
 * Custom hook for lead form state management
 * Handles form values, validation, and step navigation
 */

import { useState, useCallback, useEffect } from 'react';
import type { FormField, FormFieldKey } from '@/types/lead';

interface WizardStep {
  stepNumber: number;
  title: string;
  fieldKeys: FormFieldKey[];
}

const WIZARD_STEPS: WizardStep[] = [
  { 
    stepNumber: 1, 
    title: 'Personal Information', 
    fieldKeys: ['name', 'mobile', 'email', 'gender', 'maritalStatus'] 
  },
  { 
    stepNumber: 2, 
    title: 'Address Information', 
    fieldKeys: ['addressType', 'permanentAddress', 'pincode'] 
  },
  { 
    stepNumber: 3, 
    title: 'Employment & Income', 
    fieldKeys: ['employmentType', 'salary', 'companyAddress', 'companyPincode', 'companyName', 'modeOfSalary'] 
  },
  { 
    stepNumber: 4, 
    title: 'Identity Verification', 
    fieldKeys: ['pan'] 
  }
];

interface UseLeadFormReturn {
  // State
  currentStep: number;
  firstName: string;
  lastName: string;
  formValues: Record<string, string>;
  formErrors: Record<string, string>;
  
  // Step management
  currentStepConfig: WizardStep;
  currentStepFields: FormField[];
  canGoBack: boolean;
  canGoNext: boolean;
  
  // Actions
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  handleFieldChange: (key: string, value: string) => void;
  handleNext: () => void;
  handleBack: () => void;
  validateCurrentStep: () => boolean;
  initializeFormValues: (fields: FormField[], userIp: string) => void;
}

export const useLeadForm = (fields: FormField[]): UseLeadFormReturn => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const getCurrentStepConfig = useCallback((): WizardStep => {
    return WIZARD_STEPS[currentStep - 1];
  }, [currentStep]);

  const getCurrentStepFields = useCallback((): FormField[] => {
    const step = getCurrentStepConfig();
    return fields
      .filter(f => step.fieldKeys.includes(f.key))
      .sort((a, b) => a.order - b.order);
  }, [currentStep, fields, getCurrentStepConfig]);

  const handleFieldChange = useCallback((key: string, value: string): void => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [formErrors]);

  const validateCurrentStep = useCallback((): boolean => {
    const currentFields = getCurrentStepFields();
    const errors: Record<string, string> = {};
    
    currentFields.forEach((field) => {
      if (field.key === 'name' && field.isMandatory) {
        if (!firstName.trim()) {
          errors['firstName'] = 'First Name is required';
        }
        if (!lastName.trim()) {
          errors['lastName'] = 'Last Name is required';
        }
      } else if (field.isMandatory && !formValues[field.key]?.trim()) {
        errors[field.key] = `${field.title} is required`;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [getCurrentStepFields, formValues, firstName, lastName]);

  const scrollToFirstError = useCallback((): void => {
    const firstError = document.querySelector('.border-red-300');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleNext = useCallback((): void => {
    if (!validateCurrentStep()) {
      scrollToFirstError();
      return;
    }
    setCurrentStep(prev => prev + 1);
  }, [validateCurrentStep, scrollToFirstError]);

  const handleBack = useCallback((): void => {
    setCurrentStep(prev => prev - 1);
    setFormErrors({});
  }, []);

  const initializeFormValues = useCallback((fields: FormField[], userIp: string): void => {
    const initialValues: Record<string, string> = {};
    
    fields.forEach((field) => {
      if (field.key === 'ConsentIp') {
        initialValues[field.key] = userIp;
      } else if (field.key === 'name') {
        const fullName = field.value?.trim() || '';
        if (fullName) {
          const nameParts = fullName.split(' ');
          setFirstName(nameParts[0] || '');
          setLastName(nameParts.slice(1).join(' ') || '');
        }
        initialValues[field.key] = fullName;
      } else {
        initialValues[field.key] = field.value?.trim() || '';
      }
    });
    
    setFormValues(initialValues);
  }, []);

  return {
    currentStep,
    firstName,
    lastName,
    formValues,
    formErrors,
    currentStepConfig: getCurrentStepConfig(),
    currentStepFields: getCurrentStepFields(),
    canGoBack: currentStep > 1,
    canGoNext: currentStep < 4,
    setFirstName,
    setLastName,
    handleFieldChange,
    handleNext,
    handleBack,
    validateCurrentStep,
    initializeFormValues,
  };
};
