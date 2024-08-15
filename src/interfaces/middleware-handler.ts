import type { NextHandler } from 'next-connect';
import { CustomRequest } from '../lib/custom-request';
import { CustomResponse } from '../lib/custom-response';
import { NextResponse } from 'next/server';

export interface IMiddlewareHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown,
  TUser = unknown,
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload, TUser>,
    res: CustomResponse<TResponseData>,
    next: NextHandler,
  ): Promise<NextResponse<TResponseData> | void>;
}
