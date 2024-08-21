# Migration Guide: Version 1 to Version 2

## Overview

Version 2 of `nexpresst` introduces significant changes to the router API, including the replacement of `Router` with `RouterV2`. These changes are designed to simplify how requests are handled by abstracting away the duplicated tasks. This guide will walk you through the necessary steps to migrate from Version 1 to Version 2.

## Breaking Changes

1. **Router Initialization**

Version 1:

```ts
import { Router } from 'nexpresst';
import { queryParser, jsonParser } from 'nexpresst';

export const apiRouter = () => new Router().use(queryParser).use(jsonParser);
```

Version 2:

```ts
import { RouterV2, TNextContext } from 'nexpresst';
import { NextRequest } from 'next/server';
import { queryParser, jsonParser } from 'nexpresst';

export const apiRouterV2 = (req: NextRequest, ctx: TNextContext) =>
  new RouterV2(req, ctx).use(queryParser).use(jsonParser);
```

Migration Step:

- Replace all `Router` instantiations with `RouterV2`.
- Pass `NextRequest` and `TNextContext` as parameters when constructing the `RouterV2` instance.

2. **Route Handling**

Version 1:

```ts
export function POST(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter().use(yourRouteSpecificMiddleware).post(createPostHandler);

  return processRequest(req, ctx, router);
}
```

Version 2:

```ts
export function POST(req: NextRequest, context: TNextContext) {
  return apiRouterV2(req, context).use(yourRouteSpecificMiddleware).handle(createPostHandler);
}
```

Migration Step:

- Replace `post()`, `get()`, etc., with `handle()` to execute the route handler after middleware.
- Remove `processRequest` and return `apiRouterV2` directly from the HTTP method function.
- The same syntax works for all HTTP methods.

3. **Catch-All Route**

Version 1:

```ts
const router = apiRouter().all(notFoundHandler);

export const { GET, POST, PUT, DELETE, PATCH, HEAD } = exportAllMethods(router);
```

Version 2:

```ts
export const { GET, POST, PUT, DELETE, PATCH, HEAD } = exportAllMethodsV2(
  apiRouterV2,
  notFoundHandler,
);
```

Migration Step:

- Use `exportAllMethodsV2` for exporting all the HTTP methods from the catch-all route.

## Additional Notes

- Ensure all exported HTTP methods in `route.ts` files are updated according to the new structure.
- Route handlers and middleware creation remain unchanged.
- Thoroughly test your API after migration to ensure compatibility with the new routing and middleware system.
