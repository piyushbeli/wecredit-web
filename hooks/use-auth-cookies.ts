import { useMemo } from 'react';
import { getCookie } from 'cookies-next';
import { STORAGE_MOBILE, STORAGE_AUTH_TOKEN } from '@/lib/constants/api-keys';

/**
 * Hook to directly access auth cookies
 * Useful for avoiding hydration delays and race conditions with double API calls
 * Memoized to prevent unnecessary re-renders when cookie values haven't changed
 */
export const useAuthCookies = () => {
	const mobileCookie = getCookie(STORAGE_MOBILE);
	const tokenCookie = getCookie(STORAGE_AUTH_TOKEN);

	// Memoize the processed values to prevent unnecessary re-renders
	// when the same cookie values are read multiple times
	return useMemo(() => {
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
	}, [mobileCookie, tokenCookie]);
};
