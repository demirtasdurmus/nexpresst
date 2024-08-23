import {
  exportAllHttpMethods,
  HttpMethod,
  IRouteHandler,
  ApiRouter,
  TNextContext,
} from '../../src';

describe('exportAllHttpMethods', () => {
  const mockRequest = new Request('http://localhost/api/test', {
    method: 'GET',
    headers: new Headers(),
    body: null,
    credentials: 'same-origin',
    integrity: '',
    keepalive: false,
    mode: 'cors',
    redirect: 'follow',
    referrer: '',
    referrerPolicy: '',
    signal: new AbortController().signal,
    duplex: 'half',
  });

  const mockContext = { params: {} };
  const mockMiddleware = vi.fn((req, res, next) => next());
  const mockHandler = vi.fn((req, res) => res.statusCode(404).end());

  test.each([
    ['GET', 'GET'] as HttpMethod[],
    ['POST', 'POST'] as HttpMethod[],
    ['PUT', 'PUT'] as HttpMethod[],
    ['DELETE', 'DELETE'] as HttpMethod[],
    ['PATCH', 'PATCH'] as HttpMethod[],
    ['HEAD', 'HEAD'] as HttpMethod[],
  ])('should call %s method, run middleware and execute handler', async (method: HttpMethod) => {
    const apiRouterFactory = (req: Request, ctx: TNextContext) =>
      new ApiRouter(req, ctx).use(mockMiddleware);
    const apiMethods = exportAllHttpMethods(apiRouterFactory, mockHandler as IRouteHandler);

    const res = await apiMethods[method](mockRequest, mockContext);

    expect(mockMiddleware).toHaveBeenCalled();
    expect(res.status).toBe(404);
  });
});
