import { CustomRequest, CustomResponse, expressMiddlewareAdaptor } from '../../src';

describe('expressMiddlewareAdaptor', () => {
  it('should call the Express middleware and proceed to next handler', async () => {
    // Arrange: Mock request, response, and next handler
    const mockRequest = {} as CustomRequest;
    const mockResponse = {} as CustomResponse;
    const mockNext = vi.fn();

    const expressMiddleware = vi.fn((req, res, next) => {
      next();
    });

    const wrappedMiddleware = expressMiddlewareAdaptor(expressMiddleware);

    // Act: Run the middleware
    await wrappedMiddleware(mockRequest, mockResponse, mockNext);

    // Assert: Ensure that Express middleware and next handler are called
    expect(expressMiddleware).toHaveBeenCalledWith(mockRequest, mockResponse, expect.any(Function));
    expect(mockNext).toHaveBeenCalled();
  });

  it('should propagate errors from Express middleware', async () => {
    // Arrange: Mock request, response, and next handler
    const mockRequest = {} as CustomRequest;
    const mockResponse = {} as CustomResponse;
    const mockNext = vi.fn();

    const error = new Error('Test Error');
    const expressMiddleware = vi.fn((req, res, next) => {
      next(error);
    });

    const wrappedMiddleware = expressMiddlewareAdaptor(expressMiddleware);

    // Act & Assert: Ensure error is thrown
    await expect(wrappedMiddleware(mockRequest, mockResponse, mockNext)).rejects.toThrow(
      'Test Error',
    );
  });

  it('should resolve next handler if no error occurs', async () => {
    // Arrange: Mock request, response, and next handler
    const mockRequest = {} as CustomRequest;
    const mockResponse = {} as CustomResponse;
    const mockNext = vi.fn(() => Promise.resolve());

    const expressMiddleware = vi.fn((req, res, next) => {
      next();
    });

    const wrappedMiddleware = expressMiddlewareAdaptor(expressMiddleware);

    // Act: Run the middleware
    await wrappedMiddleware(mockRequest, mockResponse, mockNext);

    // Assert: Ensure that the next handler is called without errors
    expect(mockNext).toHaveBeenCalled();
  });
});
