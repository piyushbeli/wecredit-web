import type { NextRequest } from 'next/server';

const PDF_CONTENT_TYPE = 'application/pdf';
const PDF_FILE_NAME = 'wecredit-credit-report.pdf';

function isAllowedPdfUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const isAllowedHost = url.hostname.endsWith('.amazonaws.com') || url.hostname === 'www.w3.org';
    return url.protocol === 'https:' && isAllowedHost && url.pathname.toLowerCase().endsWith('.pdf');
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  const pdfUrl = request.nextUrl.searchParams.get('url');
  if (!pdfUrl || !isAllowedPdfUrl(pdfUrl)) {
    return Response.json({ error: 'Invalid PDF URL' }, { status: 400 });
  }

  try {
    const response = await fetch(pdfUrl, { cache: 'no-store' });
    if (!response.ok || !response.body) {
      return Response.json({ error: 'PDF download failed' }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Disposition': `attachment; filename="${PDF_FILE_NAME}"`,
        'Content-Type': response.headers.get('content-type') ?? PDF_CONTENT_TYPE,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return Response.json({ error: 'PDF download failed' }, { status: 502 });
  }
}
