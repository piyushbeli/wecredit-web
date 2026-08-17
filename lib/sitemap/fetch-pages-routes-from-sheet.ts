import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';

import {
    fetchRoutesFromSheet,
    normalizeSheetSourcePath,
    type SheetRouteMapping,
} from '@/lib/sitemap/fetch-sheet-routes';

export type PagesRouteMapping = SheetRouteMapping;

export const normalizePagesSourcePath = normalizeSheetSourcePath;

/** Loads pages rewrite/sitemap rows from the "Pages" Google Sheet tab. */
export async function fetchPagesRoutesFromSheet(): Promise<PagesRouteMapping[]> {
    return fetchRoutesFromSheet({
        gid: GOOGLE_SHEET_ROUTES.PAGES_GID,
        logLabel: 'fetchPagesRoutesFromSheet',
    });
}
