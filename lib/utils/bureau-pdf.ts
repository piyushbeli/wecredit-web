import { STORAGE_BUREAU_PDF_URL, STORAGE_BUREAU_RESPONSE } from '@/lib/constants/api-keys';
import { BUREAU_PDF_DOWNLOAD_PATH } from '@/lib/constants/credit-report-routes';

const SCORE_KEY_CANDIDATES = [
  'score',
  'creditScore',
  'credit_score',
  'bureauScore',
  'bureau_score',
  'equifaxScore',
  'equifax_score',
  'Score',
  'CreditScore',
  'CCRScore',
  'ccrScore',
  'scoreValue',
  'ScoreValue',
  'currentScore',
  'bureauCreditScore',
] as const;

const MIN_VALID_SCORE = 300;
const MAX_VALID_SCORE = 900;

/**
 * Parses a candidate value into a bureau score within the Equifax range.
 */
function parseScoreValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const rounded = Math.round(value);
    if (rounded >= MIN_VALID_SCORE && rounded <= MAX_VALID_SCORE) {
      return rounded;
    }
    return undefined;
  }
  if (typeof value === 'string') {
    const digits = value.replace(/[^\d.]/g, '');
    if (!digits) {
      return undefined;
    }
    return parseScoreValue(Number(digits));
  }
  return undefined;
}

/**
 * Deep-searches bureau API JSON for a credit score value.
 */
export function extractBureauCreditScore(data: unknown, depth = 0): number | undefined {
  if (depth > 6 || data === null || data === undefined) {
    return undefined;
  }
  if (typeof data !== 'object') {
    return parseScoreValue(data);
  }
  if (Array.isArray(data)) {
    for (const item of data) {
      const nested = extractBureauCreditScore(item, depth + 1);
      if (nested !== undefined) {
        return nested;
      }
    }
    return undefined;
  }
  const record = data as Record<string, unknown>;
  for (const key of SCORE_KEY_CANDIDATES) {
    if (key in record) {
      const direct = parseScoreValue(record[key]);
      if (direct !== undefined) {
        return direct;
      }
    }
  }
  for (const [key, value] of Object.entries(record)) {
    if (/score/i.test(key)) {
      const fromKey = parseScoreValue(value);
      if (fromKey !== undefined) {
        return fromKey;
      }
    }
  }
  for (const value of Object.values(record)) {
    if (typeof value === 'object' && value !== null) {
      const nested = extractBureauCreditScore(value, depth + 1);
      if (nested !== undefined) {
        return nested;
      }
    }
  }
  return undefined;
}

/**
 * Extracts a PDF URL from bureau API response shapes.
 */
export function extractBureauPdfUrl(data: unknown): string | undefined {
  if (
    typeof data === 'object' &&
    data !== null &&
    'pdfUrl' in data &&
    typeof data.pdfUrl === 'string' &&
    data.pdfUrl.length > 0
  ) {
    return data.pdfUrl;
  }
  return undefined;
}

/**
 * Persists the full bureau API payload for the credit-score dashboard.
 */
export function storeBureauResponse(response: unknown): void {
  if (typeof window === 'undefined' || response === undefined) {
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_BUREAU_RESPONSE, JSON.stringify(response));
  } catch {
    // Ignore quota / serialization errors — PDF URL may still be available.
  }
  const pdfUrl = extractBureauPdfUrl(response);
  if (pdfUrl) {
    storeBureauPdfUrl(pdfUrl);
  }
}

/**
 * Reads the stored bureau API payload, if any.
 */
export function getStoredBureauResponse(): unknown | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = sessionStorage.getItem(STORAGE_BUREAU_RESPONSE);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

/**
 * Persists the bureau PDF URL for unlock CTAs.
 */
export function storeBureauPdfUrl(pdfUrl: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(STORAGE_BUREAU_PDF_URL, pdfUrl);
}

/**
 * Reads the stored bureau PDF URL, if any.
 */
export function getStoredBureauPdfUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(STORAGE_BUREAU_PDF_URL);
}

/**
 * Downloads the PDF through the same-origin attachment endpoint.
 */
export function downloadBureauPdfReport(
  pdfUrl: string,
  fileName = 'wecredit-credit-report.pdf'
): boolean {
  if (!pdfUrl.trim()) {
    return false;
  }
  let link: HTMLAnchorElement | null = null;
  try {
    link = document.createElement('a');
    link.href = `${BUREAU_PDF_DOWNLOAD_PATH}?url=${encodeURIComponent(pdfUrl)}`;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    return true;
  } catch {
    return false;
  } finally {
    link?.remove();
  }
}
