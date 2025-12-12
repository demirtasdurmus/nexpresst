/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiRouterFactory, HttpMethodHandlers, IRouteHandler, TNextContext } from '../interfaces';

/**
 * This function is used to export all the HTTP methods for a given API router.
 * It returns an object with all the HTTP methods as keys and the API router as the value.
 * @param apiRouter The API router to export the HTTP methods from.
 * @param handler The handler to export the HTTP methods from.
 * @returns An object with all the HTTP methods as keys and the API router as the value.
 */
export function exportAllHttpMethods<Req extends Request, Ctx extends TNextContext<any>>(
  apiRouter: ApiRouterFactory<Req, Ctx>,
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
