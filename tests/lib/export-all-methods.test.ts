import { exportAllMethods, processRequest, Router, TNextContext } from '../../src';

vi.mock('../../src/lib/process-request');

describe('exportAllMethods', () => {
  let router: Router;
  let req: Request;
  let ctx: TNextContext;

  beforeEach(() => {
    router = new Router();
    req = new Request('https://example.com');
    ctx = {} as TNextContext;
  });

  it('should return an object with all HTTP methods', () => {
    const handlers = exportAllMethods(router);

    expect(handlers).toHaveProperty('GET');
    expect(handlers).toHaveProperty('POST');
    expect(handlers).toHaveProperty('PUT');
    expect(handlers).toHaveProperty('DELETE');
    expect(handlers).toHaveProperty('PATCH');
    expect(handlers).toHaveProperty('HEAD');
  });

  it('should call processRequest for GET method', async () => {
    const handlers = exportAllMethods(router);

    await handlers.GET(req, ctx);

    expect(processRequest).toHaveBeenCalledWith(req, ctx, router);
  });

  it('should call processRequest for POST method', async () => {
    const handlers = exportAllMethods(router);

    await handlers.POST(req, ctx);

    expect(processRequest).toHaveBeenCalledWith(req, ctx, router);
  });

  it('should call processRequest for PUT method', async () => {
    const handlers = exportAllMethods(router);

    await handlers.PUT(req, ctx);

    expect(processRequest).toHaveBeenCalledWith(req, ctx, router);
  });

  it('should call processRequest for PATCH method', async () => {
    const handlers = exportAllMethods(router);

    await handlers.PATCH(req, ctx);

    expect(processRequest).toHaveBeenCalledWith(req, ctx, router);
  });

  it('should call processRequest for DELETE method', async () => {
    const handlers = exportAllMethods(router);

    await handlers.DELETE(req, ctx);

    expect(processRequest).toHaveBeenCalledWith(req, ctx, router);
  });

  it('should call processRequest for HEAD method', async () => {
    const handlers = exportAllMethods(router);

    await handlers.HEAD(req, ctx);

    expect(processRequest).toHaveBeenCalledWith(req, ctx, router);
  });
});
