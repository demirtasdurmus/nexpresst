import { HttpMethodHandlers, TNextContext } from '../interfaces';
import { processRequest } from './process-request';
import { Router } from './router';

export function exportAllMethods<Req extends Request>(router: Router): HttpMethodHandlers<Req> {
  return {
    GET: (req: Req, ctx: TNextContext) => processRequest(req, ctx, router),
    POST: (req: Req, ctx: TNextContext) => processRequest(req, ctx, router),
    PUT: (req: Req, ctx: TNextContext) => processRequest(req, ctx, router),
    DELETE: (req: Req, ctx: TNextContext) => processRequest(req, ctx, router),
    PATCH: (req: Req, ctx: TNextContext) => processRequest(req, ctx, router),
    HEAD: (req: Req, ctx: TNextContext) => processRequest(req, ctx, router),
  };
}
