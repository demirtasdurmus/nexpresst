# Nextpress

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![npm latest version](https://img.shields.io/npm/v/nextpress/latest.svg)](https://www.npmjs.com/package/nextpress)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

Nextpress is a lightweight library that brings Express-like API routing to your Next.js applications. It simplifies the process of building scalable and modular API endpoints, with built-in support for TypeScript, middlewares, and error handling.

## Features

* Express-like Routing: Use familiar patterns from Express to create API routes in Next.js.
* Middleware Support: Easily apply global and route-specific middlewares.
<!-- * TypeScript Integration: Enjoy full type safety with TypeScript support.
* Schema Validation: Validate incoming requests using Zod or similar libraries.
* Error Handling: Centralized error handling for better control and logging. -->

## Installation

```bash
npm install nextpress
```

## Getting Started

### Create an apiRouter Function

Start by creating an apiRouter function using nextpress. This function will be the base of your API routing setup:

```typescript
// @/libs/index.ts

import { createEdgeRouter } from "nextpress";
import { jsonParser, cors, errorHandler } from "./middlewares";

export function apiRouter() {
  return createEdgeRouter()
    .use(errorHandler) // Global error handling middleware
    .use(cors) // Global CORS middleware
    .use(jsonParser); // Global JSON body parser middleware
}
```

### Create a Basic HTTP Endpoint

Now, let's create a basic HTTP endpoint using nextpress with route-specific middleware:

```typescript
// @/app/api/posts/route.ts

import { apiRouter } from "@/libs";
import { validate } from "@/libs/middlewares";
import { z } from "zod";
import { IRouteHandler } from "nextpress";

// Define a Zod schema for validation
const postSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
});

// Type inference from the Zod schema
type TPostPayload = z.infer<typeof postSchema>;

// Define a POST route handler
const createPostHandler: IRouteHandler<unknown, unknown, TPostPayload> = async (
  req,
  res
) => {
  // Access validated data with type support
  const { title, description } = req.payload;

  // Business logic here

  return res.status(201).send({
    id: "some-generated-unique-id",
    title,
    description,
  });
};

// Create the router and attach the handler
const router = apiRouter()
  .use(validate("payload", postSchema)) // Route-specific middleware for validation
  .post(createPostHandler);

export default router;
```

### Using Typescript Support

`nextpress` provides strong TypeScript support out of the box. Types are inferred from Zod schemas, allowing you to write type-safe handlers and middlewares.

```typescript
// Type inference ensures req.payload is correctly typed
console.log(req.payload.title); // string
console.log(req.payload.description); // string
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

## Author

- [**Durmus Demirtas**](https://github.com/demirtasdurmus)
