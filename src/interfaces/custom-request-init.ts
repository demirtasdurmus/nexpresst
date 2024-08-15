/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export interface CustomRequestInit extends RequestInit {
  params?: any;
  query?: any;
  payload?: any;
  user?: any;
}
