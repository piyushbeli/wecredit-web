import { getCookie } from 'cookies-next';
import { STORAGE_MOBILE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';

/**
 * Hook to directly access auth cookies
 * Useful for avoiding hydration delays and race conditions with double API calls
 */
export const useAuthCookies = () => {
	const mobileCookie = getCookie(STORAGE_MOBILE);
	const tokenCookie = getCookie(STORAGE_AUTH_TOKEN);

	// Cast to string or null/undefined as getCookie return type can optionally vary based on version
	const mobile = mobileCookie ? String(mobileCookie) : null;
	const token = tokenCookie ? String(tokenCookie) : null;
	const isAuthenticated = !!(mobile && token);

	const hasAuthCookies = !!(mobile && token);

	return {
		mobile,
		token,
		hasAuthCookies,
		isAuthenticated
	};
};
