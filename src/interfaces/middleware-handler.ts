import { CustomRequest } from '../lib/custom-request';
import { CustomResponse } from '../lib/custom-response';
import { NextResponse } from 'next/server';
import { NextHandler } from './util-types';

export interface IMiddlewareHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown,
  TSession = unknown,
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload, TSession>,
    res: CustomResponse<TResponseData>,
    next: NextHandler,
  ): Promise<NextResponse<TResponseData> | void>;
}
