import { HttpMethodHandlers, IRouteHandler, ApiRouterV2Factory, TNextContext } from '../interfaces';

export function exportAllMethodsV2<Req extends Request, Ctx extends TNextContext>(
  apiRouter: ApiRouterV2Factory<Req, Ctx>,
  handler: IRouteHandler,
): HttpMethodHandlers<Req, Ctx> {
  return {
    GET: (req: Req, ctx: Ctx) => apiRouter(req, ctx).handle(handler),
    POST: (req: Req, ctx: Ctx) => apiRouter(req, ctx).handle(handler),
    PUT: (req: Req, ctx: Ctx) => apiRouter(req, ctx).handle(handler),
    DELETE: (req: Req, ctx: Ctx) => apiRouter(req, ctx).handle(handler),
    PATCH: (req: Req, ctx: Ctx) => apiRouter(req, ctx).handle(handler),
    HEAD: (req: Req, ctx: Ctx) => apiRouter(req, ctx).handle(handler),
  };
}
