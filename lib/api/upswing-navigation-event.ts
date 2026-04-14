import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS } from '@/lib/constants/api-keys';
import { getEffectivePartnerCode } from '../utils/effective-partner-code';

const UPSWING_FORWARD_PATH = '/api/public';
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
  apiEndpoint: string;
}

const buildUpswingNavigationEventBody = (
  mobile: string,
  buttonUrl: string,
): UpswingNavigationEventPayload => {
  return {
    mobile,
    journey: UPSWING_JOURNEY,
    eventType: UPSWING_EVENT_TYPE,
    buttonName: UPSWING_BUTTON_NAME,
    buttonUrl,
    partnerCode: getEffectivePartnerCode(),
    frontendTimestamp: new Date().toISOString(),
    apiEndpoint:ENDPOINTS.PUBLIC.UPSWING_NAVIGATION_EVENT
  };
};

const getUpswingNavigationEventUrl = (): string => {
  return `${wecreditConfig.apiUrl}${UPSWING_FORWARD_PATH}`;
};

export const buildUpswingForwardRequestUrl = (mobile: string): string => {
  return `${wecreditConfig.apiUrl}${UPSWING_FORWARD_PATH}?mobile=${mobile}`;
};

const getButtonUrl = (kind: UpswingButtonUrlKind, mobile: string): string => {
  if (kind === 'createLead') {
    return ENDPOINTS.PUBLIC.CREATE_LEAD;
  }
  return buildUpswingForwardRequestUrl(mobile);
};

export const postUpswingNavigationEvent = async (
  payload: UpswingNavigationEventPayload
): Promise<void> => {

  try {
    await fetch(getUpswingNavigationEventUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  );
  void postUpswingNavigationEvent(payload);
};

export const notifyForwardNavigationEvent = (
  mobile: string,
): void => {
  const payload = buildUpswingNavigationEventBody(
    mobile,
    getButtonUrl('forward', mobile),
  );
  void postUpswingNavigationEvent(payload);
};
