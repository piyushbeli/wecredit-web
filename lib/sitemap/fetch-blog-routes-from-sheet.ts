/**
 * Fetches blog route mappings from a public Google Sheet CSV export.
 * Sheet columns: Destination (external URL), source (on-site path).
 */

const DEFAULT_SHEET_ID = '1-EPYlYvCImOcqBSamBG1f5ak_-xaSM-Ddk8wv6QHkiU';
const DEFAULT_BLOG_GID = '1704517346';
const SHEET_REVALIDATE_SECONDS = 3600;

export interface BlogRouteMapping {
  destination: string;
  source: string;
}

const getSheetExportUrl = (): string => {
  const sheetId = process.env.GOOGLE_SHEET_ID ?? DEFAULT_SHEET_ID;
  const gid = process.env.GOOGLE_SHEET_BLOG_GID ?? DEFAULT_BLOG_GID;
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

/**
 * Ensures path has leading and trailing slashes (matches next.config trailingSlash: true).
 */
export const normalizeBlogSourcePath = (path: string): string => {
  const trimmed = path.trim();
  if (!trimmed) return '';
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

/**
 * Parses a single CSV line, respecting double-quoted fields.
 */
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

function parseBlogRoutesFromCsv(csvText: string): BlogRouteMapping[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  const destinationIndex = findColumnIndex(headers, 'destination');
  const sourceIndex = findColumnIndex(headers, 'source');

  if (destinationIndex === -1 || sourceIndex === -1) {
    console.warn('[fetchBlogRoutesFromSheet] Missing Destination or source column in sheet');
    return [];
  }

  const mappings: BlogRouteMapping[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const columns = parseCsvLine(lines[i]);
    const destination = columns[destinationIndex]?.trim() ?? '';
    const source = normalizeBlogSourcePath(columns[sourceIndex] ?? '');

    if (!destination || !source || !source.startsWith('/blog')) {
      continue;
    }

    mappings.push({ destination, source });
  }

  return mappings;
}

/**
 * Loads blog rewrite/sitemap rows from the configured Google Sheet tab.
 */
export async function fetchBlogRoutesFromSheet(): Promise<BlogRouteMapping[]> {
  try {
    const response = await fetch(getSheetExportUrl(), {
      next: { revalidate: SHEET_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.warn(
        `[fetchBlogRoutesFromSheet] Sheet fetch failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const csvText = await response.text();
    return parseBlogRoutesFromCsv(csvText);
  } catch (error) {
    console.warn('[fetchBlogRoutesFromSheet] Unable to load blog routes from sheet:', error);
    return [];
  }
}
