/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEdgeRouter } from 'next-connect';
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';

export function router(): ReturnType<typeof createEdgeRouter<CustomRequest, CustomResponse>> {
  return createEdgeRouter<CustomRequest<any, any, any, any>, CustomResponse<any>>();
}
