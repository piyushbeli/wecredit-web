import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS } from '@/lib/constants/api-keys';
import { getEffectivePartnerCode } from '../utils/effective-partner-code';
import { buildHeaders } from './wecredit';

const UPSWING_PUBLIC_PATH = '/api/public';
const UPSWING_FORWARD_PATH = '/api/forward'
const UPSWING_JOURNEY = 'upswing';
const UPSWING_EVENT_TYPE = 'button_click';
const UPSWING_BUTTON_NAME = 'apply_now';

type UpswingButtonUrlKind = 'createLead' | 'forward';

export interface UpswingNavigationEventPayload {
  mobile: string;
  journey: string;
  eventType: string;
  buttonName: string;
  buttonUrl: string;
  partnerCode: string;
  frontendTimestamp: string;
  endpoint: string;
}

const buildUpswingNavigationEventBody = (
  mobile: string,
  buttonUrl: string,
  buttonName: string,
): UpswingNavigationEventPayload => {
  return {
    mobile,
    journey: UPSWING_JOURNEY,
    eventType: UPSWING_EVENT_TYPE,
    buttonName,
    buttonUrl,
    partnerCode: getEffectivePartnerCode(),
    frontendTimestamp: new Date().toISOString(),
    endpoint:ENDPOINTS.PUBLIC.UPSWING_NAVIGATION_EVENT
  };
};

const getUpswingNavigationEventUrl = (): string => {
  return `${wecreditConfig.apiUrl}${UPSWING_PUBLIC_PATH}`;
};

export const buildUpswingForwardRequestUrl = (mobile: string): string => {
  return `${wecreditConfig.apiUrl}${UPSWING_FORWARD_PATH}?mobile=${mobile}`;
};

const getButtonUrl = (kind: UpswingButtonUrlKind, mobile: string): string => {
  if (kind === 'createLead') {
    return '/api/v2/sublender/create-lead';
  }
  return buildUpswingForwardRequestUrl(mobile);
};

export const postUpswingNavigationEvent = async (
  payload: UpswingNavigationEventPayload
): Promise<void> => {

  try {
    const header = buildHeaders({});
    await fetch(getUpswingNavigationEventUrl(), {
      method: 'POST',
      headers: header,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch (error) {
    // This event is analytics-only and must never block UX flows.
    console.error('[upswing-navigation-event] Failed to post event', error);
  }
};

export const notifyCreateLeadNavigationEvent = (
  mobile: string,
): void => {
  const payload = buildUpswingNavigationEventBody(
    mobile,
    getButtonUrl('createLead', mobile),
    "create_lead",
  );
  void postUpswingNavigationEvent(payload);
};

/** Resolves after the event POST completes (or fails silently). Use before navigation when the request must not be aborted by a redirect. */
export const notifyForwardNavigationEvent = async (
  mobile: string,
  utmLink: string,
): Promise<void> => {
  const payload = buildUpswingNavigationEventBody(
    mobile,
    utmLink,
    "apply_now",
  );
  await postUpswingNavigationEvent(payload);
};
