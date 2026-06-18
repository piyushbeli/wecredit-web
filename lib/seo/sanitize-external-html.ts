/**
 * Strips document-level wrapper tags from HTML fetched from external sources (e.g. S3).
 * S3-hosted HTML files sometimes include full <html>/<head>/<body> structure which,
 * when injected via dangerouslySetInnerHTML, creates invalid nested documents.
 *
 * Also removes the first <h1> block so the page component can render a semantic H1 itself.
 */
export function sanitizeExternalHtml(html: string): string {
  return html
    // Remove doctype
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    // Remove <html ...> and </html>
    .replace(/<\/?html[^>]*>/gi, '')
    // Remove entire <head>...</head> block (including <title>, <meta>, <link>, etc.)
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
    // Remove <body ...> and </body>
    .replace(/<\/?body[^>]*>/gi, '')
    // Remove first <h1>...</h1> — the page renders its own semantic H1
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '')
    .trim();
}

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const INDIAN_PHONE_PATTERN = /\+91[\s-]?\d(?:[\s-]?\d){9,11}\b/g;

const phoneToTelHref = (phone: string): string =>
  `tel:${phone.replace(/[^\d+]/g, '')}`;

/**
 * Adds mailto/tel links to contact details inside HTML text nodes.
 * It intentionally skips tag chunks so existing attributes and links are not rewritten.
 */
export function linkContactDetails(html: string): string {
  let isInsideAnchor = false;

  return html
    .split(/(<[^>]+>)/g)
    .map((chunk) => {
      if (chunk.startsWith('<') && chunk.endsWith('>')) {
        if (/^<a\b/i.test(chunk)) {
          isInsideAnchor = true;
        } else if (/^<\/a>/i.test(chunk)) {
          isInsideAnchor = false;
        }

        return chunk;
      }

      if (isInsideAnchor) {
        return chunk;
      }

      return chunk
        .replace(EMAIL_PATTERN, (email) => (
          `<a href="mailto:${email}">${email}</a>`
        ))
        .replace(INDIAN_PHONE_PATTERN, (phone) => (
          `<a href="${phoneToTelHref(phone)}">${phone}</a>`
        ));
    })
    .join('');
}
