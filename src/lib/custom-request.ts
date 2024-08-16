import { NextRequest } from 'next/server';
import { CustomRequestInit, RequestInfo } from '../interfaces';

export class CustomRequest<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TUser = unknown,
> extends NextRequest {
  /**
   * The following properties are used to provide type information for the custom request object.
   * They are mostly useful while creating middleware and route handlers.
   * The generics passed to these interfaces will be passed to the custom request object.
   */
  params!: TParams;
  query!: TQuery;
  payload!: TPayload;
  user!: TUser;

  constructor(input: URL | RequestInfo, init?: CustomRequestInit) {
    super(input, init);
    if (init?.params) {
      this.params = init.params;
    }

    if (init?.query) {
      this.query = init.query;
    }
  }
}
