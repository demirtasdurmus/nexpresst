import { CustomRequest } from '../lib/custom-request';
import { CustomResponse } from '../lib/custom-response';

export interface IRouteHandler<
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
  ): Promise<CustomResponse<TResponseData, TLocals>>;
}
