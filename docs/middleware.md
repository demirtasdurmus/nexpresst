# Middleware

## Using Express-Compatible Middleware

A powerful feature in `nexpresst` is the `expressMiddlewareAdapter`, which allows you to use popular Express-compatible middleware in your Next.js routes. This opens up a world of existing middleware solutions from the Express ecosystem.

```ts
import { NextRequest } from 'next/server';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { ApiRouter, TNextContext, expressMiddlewareAdapter } from 'nexpresst';

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx)
    .use(expressMiddlewareAdapter(compression())) // Using compression middleware
    .use(expressMiddlewareAdapter(cors({ origin: 'http://localhost:3000' }))) // Adding CORS middleware
    .use(expressMiddlewareAdapter(helmet())); // Adding helmet for security headers
```

## Creating Your Own Middleware

Use the `IMiddlewareHandler` interface to create custom middleware. Here, we'll create a basic `logger` middleware.

```ts
// @/lib/middlewares/logger.ts

import { IMiddlewareHandler } from 'nexpresst';

export const logger: IMiddlewareHandler = async (req, res, next) => {
  console.log(`${req.method} -- ${req.url}`);

  return next();
};
```

## Using Middleware Globally or for Specific Routes

You can create custom global middleware and register it with your global router instance to apply it to all incoming requests. Alternatively, middleware can be applied on a per-route basis.

**Example:** Global Usage

```ts
// @/lib/api-router.ts

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx).use(logger).use(otherMiddleware);

// Alternatively, you can use the following syntax for registering middleware

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx).use(logger, otherMiddleware);
```

These two middleware will be applied to all incoming requests.

**Example:** Route-specific Usage

```ts
// @/app/api/posts/route.ts

const getPostsHandler: IRouteHandler = async (req, res) => {
  return res.statusCode(200).send({ message: 'Hello from posts' });
};

export function GET(req: NextRequest, ctx: TNextContext) {
  return apiRouter(req, ctx).use(logger).use(otherMiddleware).handle(getPostsHandler);

  // Alternatively, you can use the following syntax for registering middleware

  return apiRouter(req, ctx).use(logger, otherMiddleware).handle(getPostsHandler);
}
```

These two middleware will only be applied to this specific route.

ℹ️ Note that you can always create multiple instances of the ApiRouter class with different configurations, allowing you to register each instance with different middleware for more fine-tuned control.

```ts
// @/lib/api-router.ts

export const protectedRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx).use(logger).use(protect);

export const publicRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx).use(logger);
```

Then, use the corresponding router instance in your relevant routes as follows:

```ts
// @/app/api/users/posts/route.ts

import { protectedRouter } from '@/lib/api-router';

// Users are only allowed to see their own posts
export function GET(req: NextRequest, ctx: TNextContext) {
  return protectedRouter(req, ctx).handle(someProtectedHandler);
}
```

```ts
// @/app/api/posts/route.ts

import { publicRouter } from '@/lib/api-router';

// Everyone can see the posts
export function GET(req: NextRequest, ctx: TNextContext) {
  return publicRouter(req, ctx).handle(somePublicHandler);
}
```

This approach ensures that different routes are handled according to their specific middleware requirements.

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <div>
    <a href="getting-started.md">< Getting Started</a>
  </div>
  <div>
    <a href="typescript.md">Next: TypeScript Support ></a>
  </div>
</div>
