import { IMiddlewareHandler } from '../interfaces';

/**
 * The following middleware is used to parse the JSON payload of the request.
 * If the content-type of the request is application/json, the payload is parsed and assigned to the request object.
 * @param req The request object.
 * @param _res The response object.
 * @param next The next function to be called.
 * @example
 * ```ts
 * import { Router, jsonParser } from 'nexpresst';
 *
 * export const router = new Router().use(jsonParser);
 * ```
 */
export const jsonParser: IMiddlewareHandler = async (req, _res, next) => {
  try {
    if (req.headers.get('content-type') === 'application/json') {
      const payload = await req.clone().json();

      req.payload = payload;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    /**
     * If the JSON parsing fails, we can handle the error here.
     * We are ignoring the error and letting the request pass through.
     * If client set the content-type as application/json, but the payload is not a valid JSON,
     */
  }

  return next();
};
