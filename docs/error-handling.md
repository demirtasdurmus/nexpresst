# Error Handling

You can optionally register an `onError` middleware with global router to handle errors gracefully.

```ts
// @/lib/middlewares/error-handler.ts

import { IMiddlewareHandler } from 'nexpresst';

type TErrorResponse = { name: string; message: string };

// Example error handler middleware
const errorHandler: IMiddlewareHandler<unknown, unknown, unknown, TErrorResponse> = (
  req,
  res,
  next,
) => {
  return next().catch((err: unknown) => {
    /**
     * This is just a simple demonstration of how to handle errors.
     * Add your custom error logging and response handling logic here.
     */
    if (err instanceof Error) {
      return res.statusCode(500).send({ name: err.name, message: err.message });
    }
    return res
      .statusCode(500)
      .send({ name: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
  });
};
```

And then in your `api-router.ts` file:

```ts
// @/lib/api-router.ts

import { errorHandler } from '@/lib/middlewares';

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx)
    .onError(errorHandler) // Register errorHandler middleware with your global router instance
    .use(middleware, anotherMiddleware); // Add other middlewares
```

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <div>
    <a href="typescript.md">< TypeScript Support</a>
  </div>
  <div>
    <a href="catch-all-routes.md">Next: Catch-All Routes ></a>
  </div>
</div>
