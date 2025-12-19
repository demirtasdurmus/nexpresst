import { CustomRequest } from '../lib/custom-request';
import { CustomResponse } from '../lib/custom-response';
import { NextHandler } from './util-types';

export interface IMiddlewareHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown,
  TSession = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TLocals extends Record<string, any> = Record<string, any>,
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload, TSession>,
    res: CustomResponse<TResponseData, TLocals>,
    next: NextHandler,
  ): Promise<CustomResponse<TResponseData, TLocals> | void>;
}
