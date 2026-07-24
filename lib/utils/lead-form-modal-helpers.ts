/**
 * Business logic for LeadFormModal: prefill data, credit-card payload resolution,
 * LNT consent handling, post-success navigation, and lead payload construction.
 */

import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useUrlParamsStore } from '@/stores/url-params-store';
import { getCurrentDateTime } from '@/lib/api/lead-service';
import { formatDobForApi } from '@/lib/utils/form-helpers';
import type { FormField, FormFieldKey, LeadFormData } from '@/types/lead';

export const MULTI_LENDER_PARTNER_CONSENT_KEY: FormFieldKey = 'consentPartnerTerms';

/**
 * Keeps the API order, except separate first/last-name fields always render together.
 */
export function orderLeadFormFields(fields: FormField[]): FormField[] {
  const orderedFields = [...fields].sort((a, b) => a.order - b.order);
  const firstNameField = orderedFields.find((field) => field.key === 'firstName');
  const lastNameField = orderedFields.find((field) => field.key === 'lastName');

  if (!firstNameField || !lastNameField) {
    return orderedFields;
  }

  const nameInsertionIndex = Math.min(
    orderedFields.indexOf(firstNameField),
    orderedFields.indexOf(lastNameField),
  );
  const fieldsWithoutSeparateNames = orderedFields.filter(
    (field) => field.key !== 'firstName' && field.key !== 'lastName',
  );

  fieldsWithoutSeparateNames.splice(nameInsertionIndex, 0, firstNameField, lastNameField);
  return fieldsWithoutSeparateNames;
}

/* LNT CONSENTS */
export const LNT_CONSENTS = [
  {
    key: 'consentHardPull',
    consentCode: 'HARD_PULL',
    apiText:
      'I confirm that submission of Aadhaar/Proof of possession of AADHAAR number for KYC purposes is not mandatory, however, I voluntarily consent for providing the same for authentication & verification.',
    uiText:
      'I confirm that submission of Aadhaar/Proof of possession of AADHAAR number for KYC purposes is not mandatory, however, I voluntarily consent for providing the same for authentication & verification.'
  },
  {
    key: 'consentPrivacyPolicy',
    consentCode: 'PRIVACY_POLICY',
    apiText:
      'I hereby consent in favour of L&T Finance Ltd. to collect, store & process my personal data...',
    uiText:
      'I hereby also agree to have read & understood the Personal Loan Terms & Conditions and Privacy Policy and consent to the same.',
    links: [
      {
        label: 'Personal Loan Terms & Conditions',
        url: 'https://www.ltfinance.com/docs/default-source/default-document-library/pl_application_t-c.pdf?sfvrsn=ebbca65c_3',
      },
      {
        label: 'Privacy Policy',
        url: 'https://www.ltfinance.com/privacy-policy',
      },
    ],
  },
  {
    key: 'consentIndianResident',
    consentCode: 'RESIDENTIAL_STATUS_INDIAN',
    apiText: 'I hereby consent that I am an Indian Resident.',
    uiText: 'I confirm that I am an Indian resident.',
  },
  {
    key: 'consentIncome',
    consentCode: 'HOUSEHOLD_INCOME_GTE_3L',
    apiText: 'I hereby consent that my household income is greater than Rs 3,00,000.',
    uiText: 'I hereby consent that my household income is greater than Rs 3,00,000',
  },
];

export interface LntConsentPayload {
  consentCode: string;
  consentText: string;
  submittedAt: string;
}

/** True once every LNT consent checkbox has been checked. */
export function areLntConsentsComplete(formValues: Record<string, string>): boolean {
  return LNT_CONSENTS.every((c) => formValues[c.key] === 'true');
}

/** Builds the `consents` array for the create-lead payload on the LNT / upswing_lnt flow. */
export function buildLntConsentsPayload(): LntConsentPayload[] {
  return LNT_CONSENTS.map((c) => ({
    consentCode: c.consentCode,
    consentText: c.apiText,
    submittedAt: new Date().toISOString(),
  }));
}

export const sampleLeadValues: Partial<Record<FormFieldKey, string>> = {
  name: 'Test User',
  mobile: '9876543210',
  phone: '9876543210',
  dob: '05-05-1999',
  email: 'test.user@example.com',
  pan: 'ABCDE1234F',
  pincode: '560001',
  gender: 'male',
  employmentType: 'salaried',
  salary: '50000',
  monthlyIncome: '50000',
  declaredIncome: '50000',
  loanAmount: '100000',
  requiredLoanAmount: '100000',
  companyName: 'Test Company',
  companyAddress: '123 Test Street',
  companyPincode: '560001',
  permanentAddress: '123 Test Street',
  addressType: 'current',
  maritalStatus: 'single',
  modeOfSalary: 'bank',
  consent: 'true',
};

export interface PrefillOptions {
  fields: FormField[];
  isEnabled: boolean;
  userIp: string;
}

function getPrefillValue(fieldKey: FormFieldKey, userIp: string): string | null {
  if (fieldKey === 'ConsentIp' && userIp) return userIp;
  const sampleValue = sampleLeadValues[fieldKey];
  return sampleValue ?? null;
}

export function getPrefilledFields({ fields, isEnabled, userIp }: PrefillOptions): FormField[] {
  if (!isEnabled) return fields;
  return fields.map((field) => {
    if (field.value?.trim()) return field;
    const prefillValue = getPrefillValue(field.key, userIp);
    if (!prefillValue) return field;
    return { ...field, value: prefillValue };
  });
}

/**
 * Maps Yes/No strings from the dynamic form to the boolean on LeadFormData.
 * Returns undefined when the lender did not ask the question or the answer is not yet Yes/No.
 */
export function resolveHasCreditCardForLeadPayload(
  hasCreditCardQuestionField: boolean,
  creditCardAnswer: string | undefined,
): boolean | undefined {
  if (!hasCreditCardQuestionField) {
    return undefined;
  }
  if (creditCardAnswer === 'true') {
    return true;
  }
  if (creditCardAnswer === 'false') {
    return false;
  }
  return undefined;
}

/**
 * Hide credit limit until the user selects Yes, regardless of single-page or stepper layout.
 */
export function shouldRenderFieldGivenCreditCardChoice(
  field: FormField,
  isCreditCardYes: boolean,
): boolean {
  return field.key !== 'creditCardLimit' || isCreditCardYes;
}

/**
 * Builds `/offers` navigation with `newLead=true`, optional `lenderName` from the form,
 * and affiliate / tracking params preserved from the current page query and session store
 * (so UTM, partner, etc. survive after submit when they were present on the landing URL).
 */
export function buildOffersPathAfterLeadSuccess(
  lenderNameProp: string,
  searchParams: ReadonlyURLSearchParams | null,
): string {
  const qs = new URLSearchParams(searchParams?.toString() ?? '');
  qs.delete('pre_auth');
  qs.delete('mn');
  qs.set('newLead', 'true');
  if (lenderNameProp) {
    qs.set('lenderName', lenderNameProp);
  }

  const st = useUrlParamsStore.getState();
  const mergeIfMissing = (key: string, value: string | null): void => {
    if (!value?.trim()) return;
    if (!qs.has(key)) {
      qs.set(key, value.trim());
    }
  };
  mergeIfMissing('partner', st.partner);
  mergeIfMissing('originSubLender', st.originSubLender);
  mergeIfMissing('utm_source', st.utm_source);
  mergeIfMissing('utm_medium', st.utm_medium);
  mergeIfMissing('utm_campaign', st.utm_campaign);

  if (!lenderNameProp && st.lendername) {
    if (!qs.has('lenderName') && !qs.has('lendername')) {
      qs.set('lenderName', st.lendername);
    }
  }

  return `/offers?${qs.toString()}`;
}

interface BuildLeadFormDataParams {
  formValues: Record<string, string>;
  userIp: string;
  isLntLenderOrUpswignLntLender: boolean;
  lntCompanyName: string;
  originSubLender?: string | null;
  hasCreditCardQuestionField: boolean;
}

/** Maps wizard/single-page form state into the LeadFormData payload sent to create-lead. */
export function buildLeadFormData({
  formValues,
  userIp,
  isLntLenderOrUpswignLntLender,
  lntCompanyName,
  originSubLender,
  hasCreditCardQuestionField,
}: BuildLeadFormDataParams): LeadFormData {
  const creditCardBool = resolveHasCreditCardForLeadPayload(
    hasCreditCardQuestionField,
    formValues.hasCreditCard,
  );

  return {
    name: (formValues.name || '').trim(),
    firstName: formValues.firstName || '',
    lastName: formValues.lastName || '',
    mobile: formValues.mobile || '',
    phone: formValues.phone || '',
    dob: formatDobForApi(formValues.dob || ''),
    email: formValues.email || '',
    pan: formValues.pan || '',
    pincode: formValues.pincode || '',
    gender: formValues.gender || '',
    employmentType: formValues.employmentType || '',
    salary: formValues.salary || '',
    monthlyIncome: formValues.monthlyIncome || '',
    declaredIncome: formValues.declaredIncome || '',
    loanAmount: formValues.loanAmount || '',
    requiredLoanAmount: formValues.requiredLoanAmount || '',
    maritalStatus: formValues.maritalStatus || '',
    addressType: formValues.addressType || '',
    permanentAddress: formValues.permanentAddress || '',
    modeOfSalary: formValues.modeOfSalary || '',
    companyName: isLntLenderOrUpswignLntLender ? lntCompanyName : formValues.companyName || '',
    companyAddress: formValues.companyAddress || '',
    companyPincode: formValues.companyPincode || '',
    ConsentIp: userIp || formValues.ConsentIp || '',
    ConsentDateTime: getCurrentDateTime(),
    consent: formValues.consent || 'false',
    consentPartnerTerms: formValues[MULTI_LENDER_PARTNER_CONSENT_KEY] || 'false',
    ...(isLntLenderOrUpswignLntLender && { consents: buildLntConsentsPayload() }),
    ...(originSubLender && { originSubLender }),
    hasCreditCard: creditCardBool,
    creditCardLimit: formValues.creditCardLimit || '',
  };
}
