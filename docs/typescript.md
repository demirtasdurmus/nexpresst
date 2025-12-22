# TypeScript Support

**Nexpresst** leverages TypeScript to provide strong typing for both middleware and route handlers.

## Route Handler Typing

The `IRouteHandler` interface allows you to define the types for path parameters, query parameters, request payloads, response payloads, session objects, and response locals to ensure type safety.

```ts
// @/app/api/posts/route.ts

import { IRouteHandler } from 'nexpresst';

type Session = {
  userId: number;
  roles: string[];
};

const example: IRouteHandler<
  { id: string }, // Path parameters (e.g., /posts/:id)
  { search: string }, // Query parameters (e.g., /posts?search=term)
  { title: string }, // Request payload (e.g., { title: "New Post" })
  { message: string }, // Response payload (e.g., { message: "Success" })
  Session, // Request session, if any
  { timestamp?: number } // Response locals (e.g., res.locals.timestamp)
> = async (req, res) => {
  const { id } = req.params;
  const { search } = req.query;
  const { title } = req.payload;
  const { userId, roles } = req.session;
  const { timestamp } = res.locals; // Fully typed!

  // Your handler logic here
  return res.statusCode(200).send({ message: `Post ${id} updated with title: ${title}` });
};
```

## Middleware Typing

The `IMiddlewareHandler` interface allows you to define the types for path parameters, query parameters, request payload, response payloads, session objects, and response locals to ensure type safety.

```ts
// @/lib/middlewares/example.ts

import { IMiddlewareHandler } from 'nexpresst';

type Session = {
  userId: number;
  roles: string[];
};

const example: IMiddlewareHandler<
  { id: string }, // Path parameters (e.g., /posts/:id)
  { search: string }, // Query parameters (e.g., /posts?search=term)
  { title: string }, // Request payload (e.g., { title: "New Post" })
  unknown, // Response payload (e.g., { message: "Success" })
  Session, // Request session, if any
  { timestamp?: number } // Response locals (e.g., res.locals.timestamp)
> = async (req, res, next) => {
  const { id } = req.params;
  const { search } = req.query;
  const { title } = req.payload;
  const { userId, roles } = req.session;
  const { timestamp } = res.locals;

  /**
   * If you passed a response payload type, you can return a response satisfying this type.
   * Otherwise, you can call the next function to proceed.
   */

  // your middleware logic here
  return next();
};
```

---

<table width="100%">
<tr>
<td align="left"><a href="middleware.md">< Middleware</a></td>
<td align="right"><a href="error-handling.md">Next: Error Handling ></a></td>
</tr>
</table>
