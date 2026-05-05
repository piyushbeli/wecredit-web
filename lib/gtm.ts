type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

export const GTM_EVENTS = {
  primeplFormSubmission: 'primeplformsubmission',
  offerpage: 'offerpage',
} as const;

interface PrimeplFormSubmissionPayload {
  status: string;
  declaredSalary: number;
  empType: string;
}

interface OfferpagePayload {
  offerList: string[];
  maxLoanAmount: number;
  declaredSalary?: number | string | null;
  empType?: string | null;
}

type OfferpageDeclaredSalary = number | 'undetermined';

/**
 * Parses a numeric string for analytics after stripping thousands separators.
 * `Number.parseFloat("50,000")` stops at the comma and yields 50, not 50000.
 */
const parseSalaryNumericString = (raw: string): number | undefined => {
  const normalized = raw.trim().replace(/,/g, '');
  if (!normalized) {
    return undefined;
  }
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeOfferpageDeclaredSalary = (
  declaredSalary?: number | string | null
): OfferpageDeclaredSalary => {
  if (typeof declaredSalary === 'number' && Number.isFinite(declaredSalary)) {
    return declaredSalary;
  }

  if (typeof declaredSalary === 'string') {
    const parsedSalary = parseSalaryNumericString(declaredSalary);
    if (parsedSalary !== undefined) {
      return parsedSalary;
    }
  }

  return 'undetermined';
};

const normalizeOfferpageEmpType = (empType?: string | null): string => {
  const normalizedEmpType = empType?.trim();
  return normalizedEmpType ? normalizedEmpType : 'undetermined';
};

export const pushToDataLayer = (payload: DataLayerEntry): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
};

// Keep domain-specific GTM helpers together so new events can be added cleanly.
export const pushPrimeplFormSubmission = ({
  status,
  declaredSalary,
  empType,
}: PrimeplFormSubmissionPayload): void => {
  pushToDataLayer({
    event: GTM_EVENTS.primeplFormSubmission,
    status,
    declaredSalary,
    empType,
  });
};

export const pushOfferpageEvent = ({
  offerList,
  maxLoanAmount,
  declaredSalary,
  empType,
}: OfferpagePayload): void => {

  const payload = {
    event: GTM_EVENTS.offerpage,
    status: 'success',
    offer_list: offerList,
    max_loan_amount: maxLoanAmount,
    declaredSalary: normalizeOfferpageDeclaredSalary(declaredSalary),
    empType: normalizeOfferpageEmpType(empType),
  };

  pushToDataLayer(payload);
};
