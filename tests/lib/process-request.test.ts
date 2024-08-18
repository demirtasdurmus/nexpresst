import { NextRequest } from 'next/server';
import { CustomResponse, HttpMethod, processRequest, Router, TNextContext } from '../../src';

describe('processRequest', () => {
  it('should create a CustomRequest and CustomResponse', async () => {
    const req = new NextRequest('https://example.com/api/test', { method: 'GET' });
    const context: TNextContext = { params: {} };
    const router = new Router();

    // Mock the router's execute method
    const executeMock = vi.spyOn(router, 'execute').mockResolvedValueOnce(new CustomResponse());

    const response = await processRequest(req, context, router);

    expect(executeMock).toHaveBeenCalled();
    expect(response instanceof CustomResponse).toBe(true);

    executeMock.mockRestore();
  });

  it('should pass request data correctly to CustomRequest', async () => {
    const req = new NextRequest('https://example.com/api/test', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const context: TNextContext = { params: { id: '123' } };
    const router = new Router();

    // Mock the router's execute method
    vi.spyOn(router, 'execute').mockImplementation((customReq, customRes) => {
      expect(customReq.url).toBe('https://example.com/api/test');
      expect(customReq.method).toBe('POST');
      expect(customReq.headers.get('Content-Type')).toBe('application/json');
      expect(customReq.params).toEqual({ id: '123' });
      return Promise.resolve(customRes);
    });

    await processRequest(req, context, router);
  });

  it('should set duplex mode if request body is present', async () => {
    const req = new NextRequest('https://example.com/api/test', {
      method: 'POST',
      body: 'some body content',
    });
    const context: TNextContext = { params: {} };
    const router = new Router();

    vi.spyOn(router, 'execute').mockImplementation((customReq, customRes) => {
      expect(customReq.duplex).toBe('half');
      return Promise.resolve(customRes);
    });

    await processRequest(req, context, router);
  });

  // TODO: Fix this test, currently failing
  // it('should handle requests without a body correctly', async () => {
  //   const req = new NextRequest('https://example.com/api/test', { method: 'GET' });
  //   const context: TNextContext = { params: {} };
  //   const router = new Router();

  //   vi.spyOn(router, 'execute').mockImplementation((customReq, customRes) => {
  //     expect(customReq.duplex).toBeUndefined();
  //     return Promise.resolve(customRes);
  //   });

  //   await processRequest(req, context, router);
  // });

  it('should correctly set request params from context', async () => {
    const req = new NextRequest('https://example.com/api/test', { method: 'GET' });
    const context: TNextContext = { params: { userId: 'abc123' } };
    const router = new Router();

    vi.spyOn(router, 'execute').mockImplementation((customReq, customRes) => {
      expect(customReq.params).toEqual({ userId: 'abc123' });
      return Promise.resolve(customRes);
    });

    await processRequest(req, context, router);
  });

  it('should return the response from the router', async () => {
    const req = new NextRequest('https://example.com/api/test', { method: 'GET' });
    const context: TNextContext = { params: {} };
    const router = new Router();

    const mockResponse = new CustomResponse();
    vi.spyOn(router, 'execute').mockResolvedValueOnce(mockResponse);

    const response = await processRequest(req, context, router);
    expect(response).toBe(mockResponse);
  });

  it('should handle errors thrown in the router.execute method', async () => {
    const req = new Request('https://example.com/api/test', { method: 'GET' });
    const context: TNextContext = { params: {} };
    const router = new Router();

    const error = new Error('Something went wrong');
    vi.spyOn(router, 'execute').mockRejectedValueOnce(error);

    try {
      await processRequest(req, context, router);
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  it('should correctly handle various HTTP methods', async () => {
    const methods: HttpMethod[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

    for (const method of methods) {
      const req = new Request('https://example.com/api/test', { method });
      const context: TNextContext = { params: {} };
      const router = new Router();

      vi.spyOn(router, 'execute').mockImplementation((customReq, customRes) => {
        expect(customReq.method).toBe(method);
        return Promise.resolve(customRes);
      });

      await processRequest(req, context, router);
    }
  });
});
