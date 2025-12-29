# Catch-All Route and Custom 404 Response

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
  return res.statusCode(404).send();
};

export const { GET, POST, PUT, DELETE, PATCH, HEAD } = exportAllHttpMethods(
  apiRouter,
  notFoundHandler,
);
```

With this setup, any requests to non-existent API routes will trigger the `notFoundHandler`, allowing you to customize the `404` response according to your specific requirements.

---

<p align="left"><a href="error-handling.md">< Error Handling</a></p>
<p align="right"><a href="examples.md">Next: Examples ></a></p>
