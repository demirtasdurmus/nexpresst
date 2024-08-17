import { NextRequest } from 'next/server';
import { CustomRequestInit, RequestInfo } from '../interfaces';

export class CustomRequest<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TSession = unknown,
> extends NextRequest {
  /**
   * The following properties are used to provide type information for the custom request object.
   * They are mostly useful while creating middleware and route handlers.
   * The generics passed to these interfaces will be passed to the custom request object.
   */
  params!: TParams;
  query!: TQuery;
  payload!: TPayload;
  session!: TSession;

  constructor(input: URL | RequestInfo, init?: CustomRequestInit) {
    super(input, init);

    /**
     * Params is assigned to CustomRequest initialization from the NextContext.
     * With this, we can access the params in the route handler as `req.params`.
     */
    if (init?.params) {
      this.params = init.params;
    }
  }
}
