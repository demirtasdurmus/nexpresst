# Getting Started

<!-- ⚠️ Breaking Change Notice: Version 2 Migration

Version 2 introduces significant changes to the routing API, including the shift from `Router` to `ApiRouter`. If you're upgrading from Version 1, please refer to the [Migration Guide: Version 1 to Version 2](./migrations/v1-to-v2.md) for detailed instructions. -->

## Setting Up the Router

Start by creating a function dynamically generating an apiRouter instance in your Next.js application. This function will serve as the central point for managing routes and applying global middleware.

```ts
// @/lib/api-router.ts

import { NextRequest } from 'next/server';
import { ApiRouter, TNextContext } from 'nexpresst';

export const apiRouter = (req: NextRequest, ctx: TNextContext) => new ApiRouter(req, ctx);
```

You can optionally add global middleware using the `.use()` method.

Since Next.js does not parse request bodies out of the box, `nexpresst` provides ready-to-use middleware to handle such scenarios.

```ts
import { NextRequest } from 'next/server';
import { ApiRouter, TNextContext, queryParser, jsonParser } from 'nexpresst';

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx)
    .use(queryParser) // Appends a query object to the request, accessible via `req.query`
    .use(jsonParser); // Parses the request body as JSON, accessible via `req.payload`
```

You can use your custom implementations if you prefer, but these are solid starters to get the job done initially. 😎

## Creating API Routes

Define route handlers using the `IRouteHandler` interface.

To use these handlers, pass them to the `handle()` method of the `apiRouter` instance inside the Next.js HTTP method function by directly returning the instance.

🔺 **Note:** You must still export a function with a valid HTTP method name such as `GET`, `POST` etc. from your `route.ts` file. Because it is a **strict requirement** by Next.js.

**Example:** Handling Requests

```ts
// @/app/api/posts/route.ts

import { apiRouter } from '@/lib/api-router';
import { NextRequest } from 'next/server';
import { IRouteHandler, TNextContext } from 'nexpresst';

// Define a GET handler
const getPostsHandler: IRouteHandler = async (req, res) => {
  // Your logic here

  // return res.send({ message: 'Hello from posts' }) // statusCode defaults to 200
  // or set it explicitly
  return res.statusCode(200).send({ message: 'Hello from posts' });
};

// Export GET function for Next.js routing
export function GET(req: NextRequest, ctx: TNextContext) {
  return apiRouter(req, ctx).handle(getPostsHandler);
}
```

You can handle all other HTTP methods with the above syntax.

---

<table width="100%">
<tr>
<td align="left"><a href="installation.md">< Installation</a></td>
<td align="right"><a href="middleware.md">Next: Middleware ></a></td>
</tr>
</table>
