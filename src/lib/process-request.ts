import { NextResponse } from 'next/server';
import { TNextContext } from '../interfaces';
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';
import { Router } from './router';

export function processRequest<Req extends Request = Request>(
  req: Req,
  context: TNextContext,
  router: Router,
): Promise<NextResponse<unknown>> {
  const customReq = new CustomRequest(req.url, {
    ...req,
    method: req.method,
    headers: req.headers,
    body: req.body,
    cache: req.cache,
    credentials: req.credentials,
    integrity: req.integrity,
    keepalive: req.keepalive,
    mode: req.mode,
    redirect: req.redirect,
    referrer: req.referrer,
    referrerPolicy: req.referrerPolicy,
    signal: req.signal,
    ...(req.body ? { duplex: 'half' } : {}),
    params: context.params || {},
  });

  const customRes = new CustomResponse();

  return router.run(customReq, customRes) as Promise<NextResponse<unknown>>;
}
