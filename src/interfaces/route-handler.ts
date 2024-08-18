import { NextResponse } from 'next/server';
import { CustomRequest } from '../lib/custom-request';
import { CustomResponse } from '../lib/custom-response';

export interface IRouteHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown,
  TSession = unknown,
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload, TSession>,
    res: CustomResponse<TResponseData>,
  ): Promise<NextResponse<TResponseData>>;
}
