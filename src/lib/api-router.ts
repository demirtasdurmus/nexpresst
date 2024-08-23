/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';
import { IMiddlewareHandler, IRouteHandler, TNextContext } from '../interfaces';

export class ApiRouter<Req extends Request = Request, Ctx extends TNextContext = TNextContext> {
  private customRequest: CustomRequest;

  private customResponse: CustomResponse = new CustomResponse();

  private middlewares: IMiddlewareHandler<any, any, any, any, any>[] = [];

  private errorHandler?: IMiddlewareHandler<any, any, any, any, any>;

  constructor(req: Req, ctx: Ctx) {
    this.customRequest = new CustomRequest(req.url, {
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
      params: ctx.params || {},
      ...(req.body ? { duplex: 'half' } : {}), // Enable duplex mode if body is present
    });
  }

  /**
   * Add an error handler to the router instance
   * It will be executed when an error occurs during the execution of the middlewares or route handlers
   */
  onError(handler: IMiddlewareHandler<any, any, any, any, any>) {
    this.errorHandler = handler;
    return this;
  }

  /**
   * Add a middleware to the router instance
   * It will be used to register a middleware that will be executed before the route handler
   */
  use(...middlewares: IMiddlewareHandler<any, any, any, any, any>[]) {
    this.middlewares.push(...middlewares);
    return this;
  }

  /**
   * Execute the middlewares and route handlers
   * The main function of the router instance, used to execute the middlewares and route handlers
   * And handle the errors that occur during the execution
   */
  async handle(handler: IRouteHandler<any, any, any, any, any>): Promise<void | Response> {
    try {
      /**
       * Execute all middlewares in sequence
       * If a middleware returns a response, stop the execution
       * If a middleware calls the next function, continue to the next middleware
       */
      for (const middleware of this.middlewares) {
        let nextCalled = false;

        const result = await middleware(this.customRequest, this.customResponse, () => {
          nextCalled = true;
          return Promise.resolve();
        });

        /**
         * If the middleware returns a response or the next function is not called,
         * stop the execution and return the response
         */
        if (!nextCalled || result instanceof Response) {
          return result;
        }
      }

      /**
       * If no middleware returns a response, execute the route handler
       * Execute the route handler and return the response
       */
      return await handler(this.customRequest, this.customResponse);
    } catch (err) {
      /**
       * If an error occurs during the execution, handle the error
       * If an error handler is defined, execute the error handler
       * Otherwise, log the error and return a 500 response
       */
      if (this.errorHandler) {
        return this.errorHandler(this.customRequest, this.customResponse, () =>
          Promise.reject(err),
        );
      } else {
        if (process.env.NODE_ENV !== 'test') console.error(err);
        return new Response(
          `Internal Server Error: ${
            (err as any)?.message
          }\nAdd an onError middleware to the Router instance to handle errors gracefully`,
          {
            status: 500,
          },
        );
      }
    }
  }
}
