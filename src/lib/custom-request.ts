import { NextRequest } from 'next/server';
import { CustomRequestInit } from '../interfaces/custom-request-init';
import { RequestInfo } from '../interfaces/request-info';

export class CustomRequest<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TUser = unknown,
> extends NextRequest {
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
