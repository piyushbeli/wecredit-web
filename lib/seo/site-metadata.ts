export const DEFAULT_SITE_URL = 'https://wecredit.co.in';

export const OG_IMAGE_URL =
  'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/og-image.jpg';

/**
 * Brand logo for structured data (Organization/FinancialService JSON-LD).
 * Transparent WeCredit logo — renders correctly on Google's light search UI.
 */
export const BRAND_LOGO_URL =
  'https://wecredit-main-website-assets.s3.ap-south-1.amazonaws.com/logo-transparent+(2).webp';

export const getWebsiteBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_WEBSITE_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_SITE_URL;

export const buildAbsoluteSiteUrl = (path: string): string => {
  const baseUrl = getWebsiteBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};
