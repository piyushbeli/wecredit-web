import { GOOGLE_SHEET_ROUTES } from '@/lib/constants/google-sheet-routes';

export interface SheetRouteMapping {
  destination: string;
  source: string;
  showInSitemap?: boolean;
  modifiedDate?: string;
}

export interface SheetRoutesRequestOptions {
  requestTimeoutMs?: number;
}

interface FetchSheetRoutesOptions {
  gid: string;
  sourcePathPrefix: string;
  logLabel: string;
  requestTimeoutMs?: number;
}

/** Builds the public CSV export URL for a specific sheet tab. */
export const getSheetExportUrl = (gid: string): string => {
  return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ROUTES.SHEET_ID}/export?format=csv&gid=${gid}`;
};

/**
 * Ensures path has leading and trailing slashes (matches next.config trailingSlash: true).
 */
export const normalizeSheetSourcePath = (path: string): string => {
  const trimmed = path.trim();
  if (!trimmed) return '';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  fields.push(current.trim());
  return fields;
}

function findColumnIndex(headers: string[], name: string): number {
  const normalized = name.toLowerCase();
  return headers.findIndex((header) => header.toLowerCase() === normalized);
}

function findColumnIndexFromNames(headers: string[], names: string[]): number {
  for (const name of names) {
    const index = findColumnIndex(headers, name);
    if (index !== -1) {
      return index;
    }
  }
  return -1;
}

function parseRoutesFromCsv(
  csvText: string,
  { sourcePathPrefix, logLabel }: Pick<FetchSheetRoutesOptions, 'sourcePathPrefix' | 'logLabel'>
): SheetRouteMapping[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const destinationIndex = findColumnIndex(headers, 'destination');
  const sourceIndex = findColumnIndex(headers, 'source');
  const showInSitemapIndex = findColumnIndex(headers, 'showInSitemap');
  const modifiedDateIndex = findColumnIndexFromNames(headers, [
    'modifiedDate',
    'modfiedDate',
  ]);

  if (destinationIndex === -1 || sourceIndex === -1) {
    console.warn(`[${logLabel}] Missing Destination or source column in sheet`);
    return [];
  }

  const mappings: SheetRouteMapping[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const columns = parseCsvLine(lines[i]);
    const destination = columns[destinationIndex]?.trim() ?? '';
    const source = normalizeSheetSourcePath(columns[sourceIndex] ?? '');
    const showInSitemap =
      showInSitemapIndex === -1
        ? true
        : (columns[showInSitemapIndex] ?? '').trim().toLowerCase() === 'true';
    const modifiedDate =
      modifiedDateIndex === -1
        ? undefined
        : (columns[modifiedDateIndex] ?? '').trim() || undefined;

    if (!destination || !source || !source.startsWith(sourcePathPrefix)) {
      continue;
    }

    mappings.push({ destination, source, showInSitemap, modifiedDate });
  }

  return mappings;
}

/**
 * Loads route mappings from a Google Sheet tab.
 * Sheet columns: Destination (external URL), source (on-site path).
 */
export async function fetchRoutesFromSheet(
  options: FetchSheetRoutesOptions
): Promise<SheetRouteMapping[]> {
  const { gid, logLabel, requestTimeoutMs } = options;
  const controller = requestTimeoutMs ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), requestTimeoutMs)
    : null;

  try {
    const response = await fetch(getSheetExportUrl(gid), {
      next: { revalidate: 300 },
      signal: controller?.signal,
    });

    if (!response.ok) {
      console.warn(
        `[${logLabel}] Sheet fetch failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const csvText = await response.text();
    return parseRoutesFromCsv(csvText, options);
  } catch (error) {
    console.warn(`[${logLabel}] Unable to load routes from sheet:`, error);
    return [];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
