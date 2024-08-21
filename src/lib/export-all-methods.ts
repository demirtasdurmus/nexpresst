import { HttpMethodHandlers, TNextContext } from '../interfaces';
import { processRequest } from './process-request';
import { Router } from './router';

/**
 * TODO: Deprecate this function when the exportAllMethodsV2 function is ready in version 2.0.0
 */
export function exportAllMethods<Req extends Request, Ctx extends TNextContext>(
  router: Router,
): HttpMethodHandlers<Req, Ctx> {
  return {
    GET: (req: Req, ctx: Ctx) => processRequest(req, ctx, router),
    POST: (req: Req, ctx: Ctx) => processRequest(req, ctx, router),
    PUT: (req: Req, ctx: Ctx) => processRequest(req, ctx, router),
    DELETE: (req: Req, ctx: Ctx) => processRequest(req, ctx, router),
    PATCH: (req: Req, ctx: Ctx) => processRequest(req, ctx, router),
    HEAD: (req: Req, ctx: Ctx) => processRequest(req, ctx, router),
  };
}
