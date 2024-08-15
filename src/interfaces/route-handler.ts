import { NextResponse } from 'next/server';
import { CustomRequest } from '../lib/custom-request';
import { CustomResponse } from '../lib/custom-response';

export interface IRouteHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown,
  TUser = unknown,
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload, TUser>,
    res: CustomResponse<TResponseData>,
  ): Promise<NextResponse<TResponseData>>;
}
