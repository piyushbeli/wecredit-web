type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

export const GTM_EVENTS = {
  primeplFormSubmission: 'primeplformsubmission',
  leadFormSubmissionSuccess: 'lead_form_submission_success',
  offerpage: 'offerpage',
} as const;

interface PrimeplFormSubmissionPayload {
  status: string;
  declaredSalary: number;
  empType: string;
}

interface LeadFormSubmissionSuccessPayload {
  declaredSalary: number;
  empType: string;
}

interface OfferpagePayload {
  offerList: string[];
  maxLoanAmount: number;
}

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

export const pushLeadFormSubmissionSuccess = ({
  declaredSalary,
  empType,
}: LeadFormSubmissionSuccessPayload): void => {
  pushToDataLayer({
    event: GTM_EVENTS.leadFormSubmissionSuccess,
    declaredSalary,
    empType,
  });
};

export const pushOfferpageEvent = ({
  offerList,
  maxLoanAmount,
}: OfferpagePayload): void => {
  pushToDataLayer({
    event: GTM_EVENTS.offerpage,
    offer_list: offerList,
    max_loan_amount: maxLoanAmount,
  });
};
