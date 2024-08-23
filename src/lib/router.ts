/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';
import { IMiddlewareHandler, IRouteHandler, HttpMethod } from '../interfaces';

/**
 * @deprecated
 * This class is deprecated and will be removed in the next major version.
 */
export class Router {
  private middlewares: IMiddlewareHandler<any, any, any, any, any>[] = [];

  private errorHandler?: IMiddlewareHandler<any, any, any, any, any>;

  private handlers: Partial<Record<string, IRouteHandler<any, any, any, any, any>>> = {};

  private addHandler(method: HttpMethod, handler: IRouteHandler<any, any, any, any, any>) {
    this.handlers[method.toUpperCase()] = handler;
    return this;
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
   * Add a route handler to the router instance
   * It will be used to register a route handler for the GET method
   */
  get(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('GET', handler);
  }

  /**
   * Add a route handler to the router instance
   * It will be used to register a route handler for the POST method
   */
  post(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('POST', handler);
  }

  /**
   * Add a route handler to the router instance
   * It will be used to register a route handler for the PUT method
   */
  put(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('PUT', handler);
  }

  /**
   * Add a route handler to the router instance
   * It will be used to register a route handler for the PATCH method
   */
  patch(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('PATCH', handler);
  }

  /**
   * Add a route handler to the router instance
   * It will be used to register a route handler for the DELETE method
   */
  delete(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('DELETE', handler);
  }

  /**
   * Add a route handler to the router instance
   * It will be used to register a route handler for the HEAD method
   */
  head(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('HEAD', handler);
  }

  /**
   * Add a route handler to the router instance
   * It will be used to register a route handler for all the HTTP methods
   */
  all(handler: IRouteHandler<any, any, any, any, any>) {
    this.get(handler).post(handler).put(handler).patch(handler).delete(handler).head(handler);
    return this;
  }

  /**
   * Execute the middlewares and route handlers
   * The main function of the router instance, used to execute the middlewares and route handlers
   * And handle the errors that occur during the execution
   */
  async execute(req: CustomRequest, res: CustomResponse): Promise<Response | void> {
    try {
      /**
       * Execute all middlewares in sequence
       * If a middleware returns a response, stop the execution
       * If a middleware calls the next function, continue to the next middleware
       */
      for (const middleware of this.middlewares) {
        let nextCalled = false;

        const result = await middleware(req, res, () => {
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
       * If the route handler is not defined for the request method, throw an error
       * Otherwise, execute the route handler
       */
      const handler = this.handlers[req.method?.toUpperCase()];
      if (handler) {
        return await handler(req, res);
      } else {
        throw new Error(
          'No HTTP method is matched with the incoming request\n*Please make sure you are registering your handler with the correct method in the router instance',
        );
      }
    } catch (err) {
      /**
       * If an error occurs during the execution, handle the error
       * If an error handler is defined, execute the error handler
       * Otherwise, log the error and return a 500 response
       */
      if (this.errorHandler) {
        return this.errorHandler(req, res, () => Promise.reject(err));
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
