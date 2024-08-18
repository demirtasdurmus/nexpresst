import { CustomRequest, CustomResponse, jsonParser } from '../../src';

describe('jsonParser', () => {
  it('should parse and assign valid JSON payload to req.payload', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ key: 'value' }),
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toEqual({ key: 'value' });
    expect(next).toHaveBeenCalled();
  });

  it('should not modify req.payload if content-type is not application/json', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'text/plain' }),
      body: 'Just a plain text',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should handle invalid JSON payload gracefully', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: 'Invalid JSON',
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should handle empty body correctly', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should work with GET requests', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'GET',
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should work with no content-type header', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should work with non-JSON content-type but JSON body', async () => {
    const req = new CustomRequest('https://example.com/api/test', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded' }),
      body: JSON.stringify({ key: 'value' }),
    });
    const res = new CustomResponse();
    const next = vi.fn();

    await jsonParser(req, res, next);

    expect(req.payload).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
