/** Escapes characters that are invalid inside XML text nodes. */
const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Builds a sitemap index XML document listing child sitemap URLs.
 * Used for the parent `/sitemap.xml` that links to page and posts sitemaps.
 */
export const buildSitemapIndexXml = (sitemapUrls: string[]): string => {
  const sitemapEntries = sitemapUrls
    .map(
      (url) =>
        `<sitemap><loc>${escapeXml(url)}</loc></sitemap>`
    )
    .join('');

  // XML declaration must be the first byte of the document (no leading whitespace).
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}</sitemapindex>`;
};
