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

const normalizeOfferpageDeclaredSalary = (
  declaredSalary?: number | string | null
): OfferpageDeclaredSalary => {
  if (typeof declaredSalary === 'number' && Number.isFinite(declaredSalary)) {
    return declaredSalary;
  }

  if (typeof declaredSalary === 'string') {
    const parsedSalary = Number.parseFloat(declaredSalary.trim());
    if (Number.isFinite(parsedSalary)) {
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
  pushToDataLayer({
    event: GTM_EVENTS.offerpage,
    offer_list: offerList,
    max_loan_amount: maxLoanAmount,
    declaredSalary: normalizeOfferpageDeclaredSalary(declaredSalary),
    empType: normalizeOfferpageEmpType(empType),
  });
};
