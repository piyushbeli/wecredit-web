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
