/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMiddlewareHandler, NextHandler } from '../interfaces';
import { CustomRequest } from './custom-request';
import { CustomResponse } from './custom-response';

/**
 * This function is used to wrap an Express middleware function so that it can be used as a middleware handler in the API router.
 * @param expressMiddleware The Express middleware function to be wrapped.
 * @returns A middleware handler that can be used in the API router.
 */
export function expressMiddlewareAdapter(
  expressMiddleware: (req: any, res: any, next: (err?: any) => void) => void,
): IMiddlewareHandler {
  return async (req: CustomRequest, res: CustomResponse, next: NextHandler): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      expressMiddleware(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(next());
        }
      });
    });
  };
}
