/**
 * WeCredit API Proxy Route
 * Proxies requests to the external WeCredit API
 * Keeps external API URL server-side and provides endpoint validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { wecreditServerConfig, isAllowedEndpoint } from '@/lib/config/server';

/** Request body structure for WeCredit API calls */
interface WeCreditRequestBody {
  endpoint: string;
  [key: string]: unknown;
}

/** Error response structure */
interface ErrorResponse {
  error: string;
  code: string;
}

/**
 * Validates the request body
 */
function validateRequestBody(body: unknown): body is WeCreditRequestBody {
  if (!body || typeof body !== 'object') {
    return false;
  }
  const { endpoint } = body as WeCreditRequestBody;
  return typeof endpoint === 'string' && endpoint.length > 0;
}

/**
 * Builds headers for the external WeCredit API request
 */
function buildExternalHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...wecreditServerConfig.devHeaders,
  };
  const mobile = request.headers.get('mobile');
  if (mobile) {
    headers['mobile'] = mobile;
  }
  const authorization = request.headers.get('authorization');
  if (authorization) {
    headers['Authorization'] = authorization;
  }
  return headers;
}

/**
 * POST /api/wecredit
 * Proxies requests to the external WeCredit API
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as unknown;
    if (!validateRequestBody(body)) {
      const errorResponse: ErrorResponse = {
        error: 'Invalid request body: endpoint is required',
        code: 'INVALID_REQUEST',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }
    if (!isAllowedEndpoint(body.endpoint)) {
      const errorResponse: ErrorResponse = {
        error: `Endpoint not allowed: ${body.endpoint}`,
        code: 'ENDPOINT_NOT_ALLOWED',
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }
    const { endpoint, ...restBody } = body;
    const externalBody = {
      ...restBody,
      endpoint,
      partnerCode: wecreditServerConfig.partnerCode,
    };
    const externalHeaders = buildExternalHeaders(request);
    const externalResponse = await fetch(wecreditServerConfig.gatewayUrl, {
      method: 'POST',
      headers: externalHeaders,
      body: JSON.stringify(externalBody),
    });
    const responseData = await externalResponse.json();
    return NextResponse.json(responseData, {
      status: externalResponse.status,
    });
  } catch (error) {
    console.error('WeCredit API proxy error:', error);
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'Internal server error',
      code: 'PROXY_ERROR',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

