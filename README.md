# Nexpresst 🚀

[![npm latest version](https://img.shields.io/npm/v/nexpresst/latest.svg)](https://www.npmjs.com/package/nexpresst) [![npm](https://img.shields.io/npm/dm/nexpresst)](https://www.npmjs.com/package/nexpresst) [![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md) [![ci](https://github.com/demirtasdurmus/nexpresst/actions/workflows/pipeline.yaml/badge.svg)](https://github.com/demirtasdurmus/nexpresst/actions/workflows/pipeline.yaml)

**Nexpresst** is a lightweight TypeScript utility designed to build Express-like API routes in Next.js applications. It leverages the Next.js App Router's file-based routing system, providing a structured way to handle HTTP methods, middleware, and response processing—all with strong TypeScript support.

## Features

- **Express-like Routing:** Use familiar patterns from Express to create API routes in Next.js.
- **Middleware Support:** Define global and route-specific middleware for fine-grained request handling.
- **Strong TypeScript Support:** Utilize TypeScript generics for type-safe request handlers and middleware, ensuring robust and predictable API interactions.
- **Easy Integration:** Seamlessly integrate with Next.js's App Router and next/server module for a smooth development experience.
- **Express Middleware Adaptor:** Now you can leverage existing Express-compatible middleware like `helmet`, `compression`, and `cors` in your Next.js API routes with the new `expressMiddlewareAdaptor` feature.

## Installation

To install `nexpresst` in your Next.js project, run:

```bash
npm install nexpresst
```

## Getting Started

<!-- ⚠️ Breaking Change Notice: Version 2 Migration

Version 2 introduces significant changes to the routing API, including the shift from `Router` to `ApiRouter`. If you're upgrading from Version 1, please refer to the [Migration Guide: Version 1 to Version 2](./docs/migrations/v1-to-v2.md) for detailed instructions. -->

### Setting Up the Router

Start by creating a function dynamically generating an apiRouter instance in your Next.js application. This function will serve as the central point for managing routes and applying global middleware.

```ts
// @/app/lib/api-router.ts

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

### Creating API Routes

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

### Using Express-Compatible Middleware

A powerful feature in `nexpresst` is the `expressMiddlewareAdaptor`, which allows you to use popular Express-compatible middleware in your Next.js routes. This opens up a world of existing middleware solutions from the Express ecosystem.

```ts
import { NextRequest } from 'next/server';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { ApiRouter, TNextContext, expressMiddlewareAdaptor } from 'nexpresst';

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx)
    .use(expressMiddlewareAdaptor(compression())) // Using compression middleware
    .use(expressMiddlewareAdaptor(cors({ origin: 'http://localhost:3000' }))) // Adding CORS middleware
    .use(expressMiddlewareAdaptor(helmet())); // Adding helmet for security headers
```

### Creating Your Own Middleware

Use the `IMiddlewareHandler` interface to create custom middleware. Here, we'll create a basic `logger` middleware.

```ts
// @/lib/middlewares/logger.ts

import { IMiddlewareHandler } from 'nexpresst';

export const logger: IMiddlewareHandler = async (req, res, next) => {
  console.log(`${req.method} -- ${req.url}`);

  return next();
};
```

### Using Middleware Globally or for Specific Routes

You can create custom global middleware and register it with your global router instance to apply it to all incoming requests. Alternatively, middleware can be applied on a per-route basis.

**Example:** Global Usage

```ts
// @/app/lib/api-router.ts

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
// @/app/lib/api-router.ts

export const protectedRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx).use(logger).use(protect);

export const publicRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx).use(logger);
```

Then, use the corresponding router instance in your relevant routes as follows:

```ts
// @/app/api/users/posts/route.ts

import { protectedRouter } from '@/app/lib/api-router';

// Users are only allowed to see their own posts
export function GET(req: NextRequest, ctx: TNextContext) {
  return protectedRouter(req, ctx).handle(someProtectedHandler);
}
```

```ts
// @/app/api/posts/route.ts

import { publicRouter } from '@/app/lib/api-router';

// Everyone can see the posts
export function GET(req: NextRequest, ctx: TNextContext) {
  return publicRouter(req, ctx).handle(someProtectedHandler);
}
```

This approach ensures that different routes are handled according to their specific middleware requirements.

### Typescript Support

**Nexpresst** leverages TypeScript to provide strong typing for both middleware and route handlers.

#### Route Handler Typing

The `IRouteHandler` interface allows you to define the types for path parameters, query parameters, request payloads, response payloads, and session objects to ensure type safety.

```ts
// @/app/api/posts/route.ts

import { IRouteHandler } from 'nexpresst';

const example: IRouteHandler<
  { id: string }, // Path parameters (e.g., /posts/:id)
  { search: string }, // Query parameters (e.g., /posts?search=term)
  { title: string }, // Request payload (e.g., { title: "New Post" })
  { message: string } // Response payload (e.g., { message: "Success" })
  { user: object } // Request session, if any
> = (req, res, next) => {
  const { id } = req.params;
  const { search } = req.query;
  const { title } = req.payload;
  const { user } = req.session;

  // Your handler logic here
  return res.statusCode(200).send({ message: `Post ${id} updated with title: ${title}` });
};
```

#### Middleware Typing

The `IMiddlewareHandler` interface allows you to define the types for path parameters, query parameters, request payload, response payloads and session objects to ensure type safety.

```ts
// @/app/lib/middlewares/example.ts

import { IMiddlewareHandler } from 'nexpresst';

const example: IMiddlewareHandler<
  { id: string }, // Path parameters (e.g., /posts/:id)
  { search: string }, // Query parameters (e.g., /posts?search=term)
  { title: string } // Request payload (e.g., { title: "New Post" })
  unknown // Response payload (e.g., { message: "Success" })
  { user: object } // Request session, if any
> = (req, res, next) => {
  const { id } = req.params;
  const { search } = req.query;
  const { title } = req.payload;
  const { user } = req.session;

/**
 * If you passed a response payload type, you can return a response satisfying this type.
 * Otherwise, you can call the next function to proceed.
*/

  // your middleware logic here
  return next();
};
```

### Error Handling

You can optionally register an `onError` middleware with global router to handle errors gracefully.

```ts
// @/app/lib/middlewares/error-handler.ts

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
// @/app/lib/api-router.ts

import { errorHandler } from '@/lib/middlewares';

export const apiRouter = (req: NextRequest, ctx: TNextContext) =>
  new ApiRouter(req, ctx)
    .onError(errorHandler) // Register errorHandler middleware with your global router instance
    .use(middleware, anotherMiddleware); // Add other middlewares
```

### Catch-All Route and Custom 404 Response

In Next.js, the file-based routing system automatically provides a default error page for requests made to non-existent endpoints. However, in modern REST APIs, relying on a generic `404` page isn't ideal.

**Nexpresst** offers a more flexible solution that allows you to handle 404 errors in a custom and developer-friendly way.

To address this issue, start by creating a [catch-all](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments) segment at the root of your `api` folder:

```bash
📦app
 ┣ 📂api
 ┃ ┣ 📂[[...params]] <--------- Catch-all route
 ┃ ┃ ┗ 📜route.ts
 ┃ ┗ 📂posts
 ┃ ┃ ┣ 📜route.ts
 ┣ 📜favicon.ico
 ┣ 📜globals.css
 ┣ 📜layout.tsx
 ┗ 📜page.tsx
```

In the `[[...params]]/route.ts` file, add the following code:

```ts
import { apiRouter } from '@/lib/api-router';
import { exportAllHttpMethods, IRouteHandler } from 'nexpresst';

const notFoundHandler: IRouteHandler = async (req, res) => {
  console.log(req.params); // // Access to params passed as a string[]
  // Define your custom 404 logic here
  return res.statusCode(404).end();
};

export const { GET, POST, PUT, DELETE, PATCH, HEAD } = exportAllHttpMethods(
  apiRouter,
  notFoundHandler,
);
```

With this setup, any requests to non-existent API routes will trigger the `notFoundHandler`, allowing you to customize the `404` response according to your specific requirements.

### Example Project

For a full example, check out the [GitHub repository](https://github.com/demirtasdurmus/example-nextjs-api-with-nexpresst) with a complete implementation.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue.

To contribute to this project, follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/<some-feature>`).
3. Make your changes.
4. Commit your changes (`git commit -m "feat: add some feature"`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
