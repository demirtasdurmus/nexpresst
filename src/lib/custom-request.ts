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

    /**
     * If the query is present in the initialization object, it is assigned to the CustomRequest instance.
     * With this, we can access the query in the route handler as `req.query`.
     */
    if (init?.query) {
      this.query = init.query;
    }

    /**
     * If the payload is present in the initialization object, it is assigned to the CustomRequest instance
     * With this, we can access the payload in the route handler as `req.payload`.
     */
    if (init?.payload) {
      this.payload = init.payload;
    }

    /**
     * If the session is present in the initialization object, it is assigned to the CustomRequest instance.
     * With this, we can access the session in the route handler as `req.session`.
     */
    if (init?.session) {
      this.session = init.session;
    }
  }
}
