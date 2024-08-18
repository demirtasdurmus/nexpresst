import { IMiddlewareHandler } from '../interfaces';

/**
 * The following middleware is used to parse the query parameters of the request.
 * The query parameters are parsed and assigned to the request object.
 * @param req The request object.
 * @param _res The response object.
 * @param next The next function to be called.
 * @example
 * ```ts
 * import { Router, queryParser } from 'nexpresst';
 *
 * export const router = new Router().use(queryParser);
 * ```
 */
export const queryParser: IMiddlewareHandler = async (req, _res, next) => {
  req.query = Object.fromEntries(req.nextUrl.searchParams.entries());

  return next();
};
