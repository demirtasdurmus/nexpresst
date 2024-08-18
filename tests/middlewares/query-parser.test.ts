import { CustomRequest, CustomResponse, queryParser } from '../../src';

describe('queryParser', () => {
  it('should parse and assign query parameters to req.query', async () => {
    const req = new CustomRequest('https://example.com/api/test?name=John&age=30', {
      method: 'GET',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({ name: 'John', age: '30' });
    expect(next).toHaveBeenCalled();
  });

  it('should handle requests without query parameters', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'GET',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({});
    expect(next).toHaveBeenCalled();
  });

  it('should handle repeated query parameters', async () => {
    const req = new CustomRequest('https://example.com/api/test?name=John&name=Jane', {
      method: 'GET',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({ name: 'Jane' }); // Last value wins
    expect(next).toHaveBeenCalled();
  });

  it('should handle query parameters with no value', async () => {
    const req = new CustomRequest('https://example.com/api/test?name=&age=30', {
      method: 'GET',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({ name: '', age: '30' });
    expect(next).toHaveBeenCalled();
  });

  it('should handle URL-encoded query parameters', async () => {
    const req = new CustomRequest('https://example.com/api/test?name=John%20Doe&age=30', {
      method: 'GET',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({ name: 'John Doe', age: '30' });
    expect(next).toHaveBeenCalled();
  });

  it('should handle complex query parameters', async () => {
    const req = new CustomRequest(
      'https://example.com/api/test?filter[age]=30&filter[status]=active',
      {
        method: 'GET',
      },
    );
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({
      'filter[age]': '30',
      'filter[status]': 'active',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should handle numeric query parameter keys', async () => {
    const req = new CustomRequest('https://example.com/api/test?123=456', {
      method: 'GET',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await queryParser(req, res, next);

    expect(req.query).toEqual({ '123': '456' });
    expect(next).toHaveBeenCalled();
  });
});
