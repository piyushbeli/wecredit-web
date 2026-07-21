import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';

import {
  fetchRoutesFromSheet,
  normalizeSheetSourcePath,
  type SheetRouteMapping,
  type SheetRoutesRequestOptions,
} from '@/lib/sitemap/fetch-sheet-routes';

export type BlogRouteMapping = SheetRouteMapping;

export const normalizeBlogSourcePath = normalizeSheetSourcePath;

/** Loads blog rewrite/sitemap rows from the "Blog Pages" Google Sheet tab. */
export async function fetchBlogRoutesFromSheet(
  options: SheetRoutesRequestOptions = {}
): Promise<BlogRouteMapping[]> {
  return fetchRoutesFromSheet({
    gid: GOOGLE_SHEET_ROUTES.BLOG_GID,
    sourcePathPrefix: '/blog',
    logLabel: 'fetchBlogRoutesFromSheet',
    requestTimeoutMs: options.requestTimeoutMs,
  });
}
