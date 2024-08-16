# Nextpress

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release) [![npm latest version](https://img.shields.io/npm/v/nextpress/latest.svg)](https://www.npmjs.com/package/nextpress) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

Nextpress is a lightweight TypeScript utility designed to build Express-like API routes in Next.js applications. It leverages the Next.js App Router's file-based routing system, providing a structured way to handle HTTP methods, middleware, and response processing, all with strong TypeScript support.

## Features

- Express-like Routing: Use familiar patterns from Express to create API routes in Next.js.
- Middleware Support: Define global and route-specific middleware for fine-grained request handling.
- Strong TypeScript Support: Utilize TypeScript generics for type-safe request handlers, ensuring robust and predictable API interactions.
- Easy Integration: Seamlessly integrate with Next.js's App Router and next/server module for a smooth development experience.

## Installation

To install `nextpress` in your Next.js project, run:

```bash
npm install nextpress
```

## Getting Started

### Setting Up the Router

Start by creating a router instance in your Next.js application. This router will serve as the central point for managing routes and applying global middleware.

```typescript
// @/app/lib/router.ts

import { Router } from 'nextpress';
// import { cors } from "./middlewares/cors";
// import { jsonParser } from "./middlewares/json-parser";

export const apiRouter = new Router();
// .use(cors) <-- Global middleware here
// .use(jsonParser); <-- Global middleware here
```

In this example, you can optionally add global middleware using the `.use()` method.

### Creating API Routes

You can define route handlers by specifying the HTTP methods (e.g., `GET`, `POST`, etc.) and attaching middleware or handlers to them.

Example: Handling GET Requests

```typescript
// @/app/api/posts/route.ts

import { apiRouter } from '@/lib/router';
import { NextRequest } from 'next/server';
import { IRouteHandler, processRequest, TNextContext } from 'nextpress';

// Define a GET handler
const getPostsHandler: IRouteHandler = async (req, res) => {
  return res.statusCode(200).send({ message: 'Hello from posts' });
};

// Export GET function for Next.js routing
export function GET(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.get(getPostsHandler); // <--- You can also append route specific middlewares here
  return processRequest(req, ctx, router);
}
```

Example: Handling POST Requests

```typescript
// @/app/api/posts/route.ts

import { apiRouter } from '@/lib/router';
import { NextRequest } from 'next/server';
import { IRouteHandler, processRequest, TNextContext } from 'nextpress';

// Define a POST handler with type support for payload and response
const createPostHandler: IRouteHandler<
  unknown, // Path parameters (not used here)
  unknown, // Query parameters (not used here)
  { title: string }, // Request payload
  { message: string } // Response payload
> = async (req, res) => {
  console.log(req.payload.title); // <--- This will come with type support
  return res.statusCode(201).send({ message: 'Post created' });
};

// Export POST function for Next.js routing
export function POST(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.post(createPostHandler);
  return processRequest(req, ctx, router);
}
```

### Typescript Support

Nextpress leverages TypeScript to provide strong typing for both middleware and route handlers.

#### Middleware Typing

When adding middleware, you can define the types for request and response objects to ensure type safety.

```typescript
// @/app/lib/middlewares/example.ts

import { IMiddlewareHandler } from 'nextpress';

const example: IMiddlewareHandler<
  { id: string }, // Path parameters (e.g., /posts/:id)
  { search: string }, // Query parameters (e.g., /posts?search=term)
  { title: string } // Request payload (e.g., { title: "New Post" })
> = (req, res, next) => {
  const { id } = req.params;
  const { search } = req.query;
  const { title } = req.payload;

  // your middleware logic here
  return next();
};
```

#### Route Handler Typing

The `IRouteHandler` interface allows you to define the types for path parameters, query parameters, request payload, and response payload.

```typescript
// @/app/api/posts/route.ts

import { IRouteHandler } from 'nextpress';

const example: IRouteHandler<
  { id: string }, // Path parameters (e.g., /posts/:id)
  { search: string }, // Query parameters (e.g., /posts?search=term)
  { title: string }, // Request payload (e.g., { title: "New Post" })
  { message: string } // Response payload (e.g., { message: "Success" })
> = (req, res, next) => {
  const { id } = req.params;
  const { search } = req.query;
  const { title } = req.payload;

  // Your handler logic here
  return res.statusCode(200).send({ message: `Post ${id} updated with title: ${title}` });
};
```

### Middleware and Route Handlers

Global middleware can be defined in the router and applied to all routes. Alternatively, middleware can be applied on a per-route basis.

```typescript
// @/app/lib/router.ts

export const apiRouter = new Router()
  .use(exampleMiddleware) // Global middleware
  .use(anotherMiddleware); // You can also use a single use and put all middlewares inside separated by commas
```

```typescript
// @/app/api/posts/route.ts

export function GET(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.use(middlewareOne, middlewareTwo).get(getPostsHandler);
  return processRequest(req, ctx, router);
}
```

### Process the Request

Finally, use the `processRequest` function to handle the request and pass it through the router.

```typescript
// @/app/api/posts/route.ts

export function GET(req: NextRequest, ctx: TNextContext) {
  const router = apiRouter.get(getPostsHandler);
  return processRequest(req, ctx, router);
}
```

### Example Project

For a full example, check out the [GitHub repository](https://github.com/demirtasdurmus/next-express) with a complete implementation.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue.

To contribute to this project, follow these steps:

1. Fork this repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Create a pull request to merge your changes into the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
