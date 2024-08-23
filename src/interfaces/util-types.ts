/* eslint-disable @typescript-eslint/no-explicit-any */

import { RouterV2 } from '../lib';

/**
 * The following interfaces are taken from the Next.js source code.
 * They are used to provide type information for the custom request and response objects.
 */
type I18NDomains = DomainLocale[];

interface I18NConfig {
  defaultLocale: string;
  domains?: I18NDomains;
  localeDetection?: false;
  locales: string[];
}

interface DomainLocale {
  defaultLocale: string;
  domain: string;
  http?: true;
  locales?: string[];
}

interface RequestInit extends globalThis.RequestInit {
  geo?: {
    city?: string;
    country?: string;
    region?: string;
  };
  ip?: string;
  nextConfig?: {
    basePath?: string;
    i18n?: I18NConfig | null;
    trailingSlash?: boolean;
  };
  signal?: AbortSignal;
}

export interface ResponseInit extends globalThis.ResponseInit {
  nextConfig?: {
    basePath?: string;
    i18n?: I18NConfig;
    trailingSlash?: boolean;
  };
  url?: string;
}

export type BodyInit = any;

/**
 * This is a custom interface extending the Next RequestInit interface.
 * It is used to provide additional information to the custom request object.
 */
export interface CustomRequestInit extends RequestInit {
  params?: any;
  query?: any;
  payload?: any;
  session?: any;
}

export type RequestInfo = Request | string;

export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ValueOrPromise<T> = T | Promise<T>;

export type NextHandler = () => ValueOrPromise<any>;

export type TNextContext = {
  params?: Record<string, string>;
};

export type HttpMethodHandlers<Req extends Request, Ctx extends TNextContext> = {
  [M in HttpMethod]: (req: Req, ctx: Ctx) => ValueOrPromise<any>;
};

export type ApiRouterV2Factory<Req, Ctx> = (req: Req, ctx: Ctx) => RouterV2;
