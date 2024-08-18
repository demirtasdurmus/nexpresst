# Nexpresst 🚀

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release) [![npm latest version](https://img.shields.io/npm/v/nexpresst/latest.svg)](https://www.npmjs.com/package/nexpresst) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

**Nexpresst** is a lightweight TypeScript utility designed to build Express-like API routes in Next.js applications. It leverages the Next.js App Router's file-based routing system, providing a structured way to handle HTTP methods, middleware, and response processing—all with strong TypeScript support.

## Features

- **Express-like Routing:** Use familiar patterns from Express to create API routes in Next.js.
- **Middleware Support:** Define global and route-specific middleware for fine-grained request handling.
- **Strong TypeScript Support:** Utilize TypeScript generics for type-safe request handlers and middleware, ensuring robust and predictable API interactions.
- **Easy Integration:** Seamlessly integrate with Next.js's App Router and next/server module for a smooth development experience.

## Installation

To install `nexpresst` in your Next.js project, run:

```bash
npm install nexpresst
```

## Getting Started

### Setting Up the Router

Start by creating a router instance in your Next.js application. This router will serve as the central point for managing routes and applying global middleware.

```ts
// @/app/lib/router.ts

import { Router } from 'nexpresst';

export const apiRouter = new Router();
```

You can optionally add global middleware using the `.use()` method.

Since Next.js does not parse request bodies out of the box, `nexpresst` provides ready-to-use middleware to handle such scenarios.

```ts
import { Router, queryParser, jsonParser } from 'nexpresst';

export const apiRouter = new Router()
  .use(queryParser) // Appends a query object to the request, accessible via `req.query`
  .use(jsonParser); // Parses the request body as JSON, accessible via `req.payload`
```

You can use your custom implementations if you prefer, but these are solid starters to get the job done initially. 😎

### Creating API Routes

Define route handlers using the `IRouteHandler` interface.

To use these handlers, register them with the global router instance using the corresponding HTTP methods (e.g., `get()` for GET requests, `post()` for POST requests, etc.). Then, pass the router to the `processRequest` function inside the Next.js HTTP method function.

🔺 **Note:** You must still use the export `function GET...` syntax because it is a **strict requirement** by Next.js.

**Example:** Handling GET Requests

```ts
// @/app/api/posts/route.ts

import { apiRouter } from '@/lib/router';
import { NextRequest } from 'next/server';
import { IRouteHandler, processRequest, TNextContext } from 'nexpresst';

// Define a GET handler
const getPostsHandler: IRouteHandler = async (req, res) => {
  // Your logic here

  // return res.send({ message: 'Hello from posts' }) // statusCode defaults to 200
  // or set it explicitly
  return res.statusCode(200).send({ message: 'Hello from posts' });
};

// Export GET function for Next.js routing
export function GET(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.get(getPostsHandler);
  return processRequest(req, ctx, router);
}
```

**Example:** Handling POST Requests

```ts
// @/app/api/posts/route.ts

import { apiRouter } from '@/lib/router';
import { NextRequest } from 'next/server';
import { IRouteHandler, processRequest, TNextContext } from 'nexpresst';

// Define a POST handler
const createPostHandler: IRouteHandler = async (req, res) => {
  // Your logic here

  return res.statusCode(201).send({ message: 'Post created' });
};

// Export POST function for Next.js routing
export function POST(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.post(createPostHandler);
  return processRequest(req, ctx, router);
}
```

### Creating Middleware

Use the `IMiddlewareHandler` interface to create custom middleware. Here, we'll create a basic `CORS` middleware for global use.

```ts
// @/lib/middlewares/cors.ts

import { IMiddlewareHandler } from 'nexpresst';

export const cors: IMiddlewareHandler = async (req, res, next) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.statusCode(204).send(null);
  }

  return next();
};
```

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

### Global and Route-Specific Middleware

You can create custom global middleware and register it with your global router instance to apply it to all incoming requests. Alternatively, middleware can be applied on a per-route basis.

**Example:** Global Usage

```ts
// @/app/lib/router.ts

import { myCustomGlobalMiddlewareOne, myCustomGlobalMiddlewareTwo } from '@/lib/middlewares';

export const apiRouter = new Router()
  .use(myCustomGlobalMiddlewareOne)
  .use(myCustomGlobalMiddlewareTwo);

// Alternatively, you can use the following syntax for registering middleware

export const apiRouter = new Router().use(myCustomGlobalMiddlewareOne, myCustomGlobalMiddlewareTwo);
```

**Example:** Route-specific Usage

```ts
// @/app/api/posts/route.ts

import { myCustomMiddlewareOne, myCustomMiddlewareTwo } from '@/lib/middlewares';

const getPostsHandler: IRouteHandler = async (req, res) => {
  return res.statusCode(200).send({ message: 'Hello from posts' });
};

export function GET(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter
    .use(myCustomMiddlewareOne)
    .use(myCustomMiddlewareTwo)
    .get(getPostsHandler);

  // Alternatively, you can use the following syntax for registering middleware

  const router = apiRouter.use(myCustomMiddlewareOne, myCustomMiddlewareTwo).get(getPostsHandler);

  return processRequest(req, ctx, router);
}
```

### Process the Request

Use the `processRequest` function to handle the request and pass it through the router.

```ts
// @/app/api/posts/route.ts

export function GET(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.get(getPostsHandler);
  return processRequest(req, ctx, router);
}
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

And then in your `router.ts` file:

```ts
// @/app/lib/router.ts

import { errorHandler } from '@/lib/middlewares';

export const apiRouter = new Router()
  .onError(errorHandler) // Register errorHandler middleware with your global router instance
  .use(middleware, anotherMiddleware); // Add other middlewares
```

### Catch-All route and Custom 404 Response

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
import { apiRouter } from '@/lib/router';
import { exportAllMethods, IRouteHandler } from 'nexpresst';

const notFoundHandler: IRouteHandler = async (req, res) => {
  console.log(req.params); // // Access to params passed as a string[]
  // Define your custom 404 logic here
  return res.statusCode(404).send(`${req.nextUrl.pathname} not found`);
};

const router = apiRouter.all(notFoundHandler);

export const { GET, POST, PUT, DELETE, PATCH, HEAD } = exportAllMethods(router);
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