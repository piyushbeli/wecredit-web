type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

export const GTM_EVENTS = {
  primeplFormSubmission: 'primeplformsubmission',
} as const;

interface PrimeplFormSubmissionPayload {
  status: string;
  declaredSalary: number;
  empType: string;
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
