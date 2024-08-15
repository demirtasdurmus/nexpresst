import { NextRequest, NextResponse } from 'next/server';
import { TNextContext } from '../interfaces/next-context';
import { createEdgeRouter } from 'next-connect';
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';

export function processRequest(
  req: NextRequest,
  context: TNextContext,
  router: ReturnType<typeof createEdgeRouter<CustomRequest, CustomResponse>>,
): Promise<NextResponse<unknown>> {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries());

  const customReq = new CustomRequest(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    // cache: req.cache,
    credentials: req.credentials,
    geo: req.geo,
    integrity: req.integrity,
    ip: req.ip,
    keepalive: req.keepalive,
    mode: req.mode,
    redirect: req.redirect,
    referrer: req.referrer,
    referrerPolicy: req.referrerPolicy,
    signal: req.signal,
    ...(req.body ? { duplex: 'half' } : {}),
    params: context.params || {},
    query,
  });

  const customRes = new CustomResponse();

  return router.run(customReq, customRes) as Promise<NextResponse<unknown>>;
}
