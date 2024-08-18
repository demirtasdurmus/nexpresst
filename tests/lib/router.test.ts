import { CustomRequest, CustomResponse, HttpMethod, Router } from '../../src';

describe('Router', () => {
  it('should execute middleware in sequence and return response from middleware', async () => {
    const router = new Router();

    const mockMiddleware = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'Middleware Response' });
    });

    router.use(mockMiddleware);

    const req = { method: 'GET' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.execute(req, res);

    expect(mockMiddleware).toHaveBeenCalledOnce();
    expect(response!.status).toEqual(200);
    expect(await response!.json()).toEqual({ message: 'Middleware Response' });
  });

  it('should execute the correct route handler based on method', async () => {
    const router = new Router();

    const mockGetHandler = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'GET Response' });
    });
    const mockPostHandler = vi.fn((req, res) => {
      return res.statusCode(201).send({ message: 'POST Response' });
    });
    const mockPutHandler = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'PUT Response' });
    });
    const mockPatchHandler = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'PATCH Response' });
    });
    const mockDeleteHandler = vi.fn((req, res) => {
      return res.statusCode(204).send();
    });

    router
      .get(mockGetHandler)
      .post(mockPostHandler)
      .put(mockPutHandler)
      .patch(mockPatchHandler)
      .delete(mockDeleteHandler);

    const reqGet = { method: 'GET' } as CustomRequest;
    const resGet = new CustomResponse();

    const reqPost = { method: 'POST' } as CustomRequest;
    const resPost = new CustomResponse();

    const reqPut = { method: 'PUT' } as CustomRequest;
    const resPut = new CustomResponse();

    const reqPatch = { method: 'PATCH' } as CustomRequest;
    const resPatch = new CustomResponse();

    const reqDelete = { method: 'DELETE' } as CustomRequest;
    const resDelete = new CustomResponse();

    const responseGet = await router.execute(reqGet, resGet);
    const responsePost = await router.execute(reqPost, resPost);
    const responsePut = await router.execute(reqPut, resPut);
    const responsePatch = await router.execute(reqPatch, resPatch);
    const responseDelete = await router.execute(reqDelete, resDelete);

    expect(mockGetHandler).toHaveBeenCalledOnce();
    expect(responseGet!.status).toEqual(200);
    expect(await responseGet!.json()).toEqual({ message: 'GET Response' });

    expect(mockPostHandler).toHaveBeenCalledOnce();
    expect(responsePost!.status).toEqual(201);
    expect(await responsePost!.json()).toEqual({ message: 'POST Response' });

    expect(mockPutHandler).toHaveBeenCalledOnce();
    expect(responsePut!.status).toEqual(200);
    expect(await responsePut!.json()).toEqual({ message: 'PUT Response' });

    expect(mockPatchHandler).toHaveBeenCalledOnce();
    expect(responsePatch!.status).toEqual(200);
    expect(await responsePatch!.json()).toEqual({ message: 'PATCH Response' });

    expect(mockDeleteHandler).toHaveBeenCalledOnce();
    expect(responseDelete!.status).toEqual(204);
  });

  it('should throw an error if no handler matches the request method', async () => {
    const router = new Router();

    const req = { method: 'DELETE' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.execute(req, res);

    expect(response!.status).toEqual(500);
    expect(await response!.text()).toEqual(
      'Internal Server Error: No HTTP method is matched with the incoming request\n*Please make sure you are registering your handler with the correct method in the router instance\nAdd an onError middleware to the Router instance to handle errors gracefully',
    );
  });

  it('should call error handler if an error occurs during middleware execution', async () => {
    const router = new Router();

    const errorHandler = vi.fn((req, res) => {
      return res.statusCode(500).send({ error: 'Error caught' });
    });

    router.onError(errorHandler);

    const req = { method: 'GET' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.execute(req, res);

    expect(errorHandler).toHaveBeenCalledOnce();
    expect(response!.status).toEqual(500);
    expect(await response!.json()).toEqual({ error: 'Error caught' });
  });

  it('should continue to the next middleware if the first middleware calls next()', async () => {
    const router = new Router();

    const firstMiddleware = vi.fn((req, res, next) => {
      return next();
    });

    const secondMiddleware = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'Final Middleware' });
    });

    router.use(firstMiddleware, secondMiddleware);

    const req = { method: 'GET' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.execute(req, res);

    expect(firstMiddleware).toHaveBeenCalledOnce();
    expect(secondMiddleware).toHaveBeenCalledOnce();
    expect(response!.status).toEqual(200);
    expect(await response!.json()).toEqual({ message: 'Final Middleware' });
  });

  it('should handle the all method correctly for all HTTP methods', async () => {
    const router = new Router();

    const mockAllHandler = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'ALL Response' });
    });

    router.all(mockAllHandler);

    const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];

    for (const method of methods) {
      const req = { method } as CustomRequest;
      const res = new CustomResponse();

      const response = await router.execute(req, res);

      expect(mockAllHandler).toHaveBeenCalledWith(req, res);
      expect(response!.status).toEqual(200);
      expect(await response!.json()).toEqual({ message: 'ALL Response' });
    }
  });
});
