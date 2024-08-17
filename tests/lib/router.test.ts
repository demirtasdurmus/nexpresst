import { CustomRequest, CustomResponse, Router } from '../../src';

describe('Router', () => {
  it('should execute middleware in sequence and return response from middleware', async () => {
    const router = new Router();

    const mockMiddleware = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'Middleware Response' });
    });

    router.use(mockMiddleware);

    const req = { method: 'GET' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.run(req, res);

    expect(mockMiddleware).toHaveBeenCalledOnce();
    expect(response!.status).toBe(200);
    expect(await response!.json()).toEqual({ message: 'Middleware Response' });
  });

  it('should execute the correct route handler based on method', async () => {
    const router = new Router();

    const mockHandler = vi.fn((req, res) => {
      return res.statusCode(200).send({ message: 'GET Response' });
    });

    router.get(mockHandler);

    const req = { method: 'GET' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.run(req, res);

    expect(mockHandler).toHaveBeenCalledOnce();
    expect(response!.status).toBe(200);
    expect(await response!.json()).toEqual({ message: 'GET Response' });
  });

  it('should throw an error if no handler matches the request method', async () => {
    const router = new Router();

    const req = { method: 'DELETE' } as CustomRequest;
    const res = new CustomResponse();

    const response = await router.run(req, res);

    expect(response!.status).toBe(500);
    expect(await response!.text()).toEqual(
      'Internal Server Error: *No http method is matched with the incoming request\n*Please check you are appending the correct http method you router instance\nAdd an onError middleware to the Router instance to handle errors gracefully',
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

    const response = await router.run(req, res);

    expect(errorHandler).toHaveBeenCalledOnce();
    expect(response!.status).toBe(500);
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

    const response = await router.run(req, res);

    expect(firstMiddleware).toHaveBeenCalledOnce();
    expect(secondMiddleware).toHaveBeenCalledOnce();
    expect(response!.status).toBe(200);
    expect(await response!.json()).toEqual({ message: 'Final Middleware' });
  });
});
