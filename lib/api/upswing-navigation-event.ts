import { wecreditConfig } from '@/lib/config';
import { ENDPOINTS } from '@/lib/constants/api-keys';

const UPSWING_NAVIGATION_EVENT_PATH = '/api/v2/sublender/upswing-navigation-event';
const UPSWING_FORWARD_PATH = '/api/forward';
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
    frontendTimestamp: new Date().toISOString(),
    apiEndpoint:'/upswing/landing'
  };
};

const getUpswingNavigationEventUrl = (): string => {
  return `${wecreditConfig.apiUrl}${UPSWING_NAVIGATION_EVENT_PATH}`;
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
  if (!payload.mobile) {
    return;
  }

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
