/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';
import { IMiddlewareHandler, IRouteHandler, HttpMethod } from '../interfaces';

export class Router {
  private middlewares: IMiddlewareHandler<any, any, any, any, any>[] = [];

  private errorHandler?: IMiddlewareHandler<any, any, any, any, any>;

  private handlers: Partial<Record<string, IRouteHandler<any, any, any, any, any>>> = {};

  private addHandler(method: HttpMethod, handler: IRouteHandler<any, any, any, any, any>) {
    this.handlers[method.toUpperCase()] = handler;
    return this;
  }

  onError(handler: IMiddlewareHandler<any, any, any, any, any>) {
    this.errorHandler = handler;
    return this;
  }

  use(...middlewares: IMiddlewareHandler<any, any, any, any, any>[]) {
    this.middlewares.push(...middlewares);
    return this;
  }

  get(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('GET', handler);
  }

  post(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('POST', handler);
  }

  put(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('PUT', handler);
  }

  patch(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('PATCH', handler);
  }

  delete(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('DELETE', handler);
  }

  head(handler: IRouteHandler<any, any, any, any, any>) {
    return this.addHandler('HEAD', handler);
  }

  async run(req: CustomRequest, res: CustomResponse): Promise<Response | void> {
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
          '*No http method is matched with the incoming request\n*Please check you are appending the correct http method you router instance',
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
            (err as any).message
          }\nAdd an onError middleware to the Router instance to handle errors gracefully`,
          {
            status: 500,
          },
        );
      }
    }
  }
}
