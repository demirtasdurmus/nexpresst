/* eslint-disable @typescript-eslint/no-unused-vars */
import { RouterV2 } from '../../src';

describe('routerV2', () => {
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
    duplex: 'half', // 'half' for supporting stream-based body
  });

  const mockContext = {
    params: { id: '1' },
  };

  it('should initialize an instance with custom request and response correctly', () => {
    const router = new RouterV2(mockRequest, mockContext);

    expect(router).toBeInstanceOf(RouterV2);
  });

  it('should execute middlewares in sequence and stop if middleware returns a response', async () => {
    const router = new RouterV2(mockRequest, mockContext);
    const middleware = vi.fn((req, res) => {
      return res.statusCode(404).send({ message: 'Not Found!' });
    });

    router.use(middleware);

    const result = await router.handle(async (req, res) =>
      res.statusCode(200).send({ message: 'Success!' }),
    );

    expect(middleware).toHaveBeenCalledOnce();
    expect(result).toBeInstanceOf(Response);
    expect(result!.status).toBe(404);
    expect(await result!.json()).toEqual({
      message: 'Not Found!',
    });
  });

  it('should execute handler if no middleware returns a response', async () => {
    const router = new RouterV2(mockRequest, mockContext);

    const middleware = vi.fn((req, res, next) => next());
    const handler = vi.fn((req, res) => res.statusCode(200).send({ message: 'OK' }));

    router.use(middleware);
    const result = await router.handle(handler);

    expect(middleware).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledOnce();
    expect(result).toBeInstanceOf(Response);
    expect(result!.status).toBe(200);
    expect(await result!.json()).toEqual({ message: 'OK' });
  });

  it('should execute error handler if error occurs', async () => {
    const router = new RouterV2(mockRequest, mockContext);
    const errorHandler = vi.fn((req, res, next) =>
      res.statusCode(500).send({ name: 'Error', message: 'Something went wrong' }),
    );

    const middleware = vi.fn((req, res, next) => {
      throw new Error('Middleware Error');
    });

    router.use(middleware).onError(errorHandler);
    const result = await router.handle(async (req, res) => res.send({ message: 'OK' }));

    expect(errorHandler).toHaveBeenCalledOnce();
    expect(result).toBeInstanceOf(Response);
    expect(result!.status).toBe(500);
    expect(await result!.json()).toEqual({ name: 'Error', message: 'Something went wrong' });
  });

  it('should return 500 response if no error handler is provided', async () => {
    const router = new RouterV2(mockRequest, mockContext);
    const middleware = vi.fn((req, res, next) => {
      throw new Error('Middleware Error');
    });

    router.use(middleware);
    const result = await router.handle(async (req, res) => res.send({ message: 'OK' }));

    expect(middleware).toHaveBeenCalledOnce();
    expect(result!.status).toBe(500);
    expect(await result!.text()).toEqual(
      'Internal Server Error: Middleware Error\nAdd an onError middleware to the Router instance to handle errors gracefully',
    );
  });
});
