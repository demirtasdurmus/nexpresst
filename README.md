# Nexpresst 🚀

[![npm latest version](https://img.shields.io/npm/v/nexpresst/latest.svg)](https://www.npmjs.com/package/nexpresst) [![npm](https://img.shields.io/npm/dm/nexpresst)](https://www.npmjs.com/package/nexpresst) [![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md) [![ci](https://github.com/demirtasdurmus/nexpresst/actions/workflows/pipeline.yaml/badge.svg)](https://github.com/demirtasdurmus/nexpresst/actions/workflows/pipeline.yaml)

**Nexpresst** is a lightweight TypeScript utility designed to build Express-like API routes in Next.js applications. It leverages the Next.js App Router's file-based routing system, providing a structured way to handle HTTP methods, middleware, and response processing—all with strong TypeScript support.

> ⚠️ **Note:** This version requires Next.js >= 15.0.0. For Next.js < 15.0.0, please use Nexpresst version 1.X.X.

## Features

- **Express-like Routing:** Use familiar patterns from Express to create API routes in Next.js.
- **Express Middleware Adapter:** You can leverage existing Express-compatible middleware like `helmet`, `compression`, `csurf` and `cors` in your Next.js API routes with the `expressMiddlewareAdapter`.
- **Custom Middleware Support:** Define global and route-specific middleware for fine-grained request handling.
- **Strong TypeScript Support:** Utilize TypeScript generics for type-safe request handlers and middleware, ensuring robust and predictable API interactions.
- **Easy Integration:** Seamlessly integrate with Next.js's App Router and next/server module for a smooth development experience.

## Quick Start

```bash
npm install nexpresst
```

## Documentation

- **[Installation](./docs/installation.md)** - Installation instructions
- **[Getting Started](./docs/getting-started.md)** - Setting up the router and creating your first routes
- **[Middleware](./docs/middleware.md)** - Using Express-compatible middleware and creating custom middleware
- **[TypeScript Support](./docs/typescript.md)** - Type-safe route handlers and middleware
- **[Error Handling](./docs/error-handling.md)** - Handling errors gracefully
- **[Catch-All Routes](./docs/catch-all-routes.md)** - Custom 404 responses for non-existent routes
- **[Examples](./docs/examples.md)** - Example projects and implementations
- **[Contributing](./docs/contributing.md)** - How to contribute to Nexpresst

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
