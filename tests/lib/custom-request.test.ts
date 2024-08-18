import { NextRequest } from 'next/server';
import { CustomRequest, CustomRequestInit } from '../../src';

describe('CustomRequest', () => {
  it('should initialize with a URL', () => {
    const url = new URL('https://example.com');
    const req = new CustomRequest(url);

    expect(req.url).toEqual('https://example.com/');
  });

  it('should initialize with RequestInfo and inherit properties from NextRequest', () => {
    const url = 'https://example.com';
    const req = new CustomRequest(url, { method: 'GET' });

    expect(req.url).toEqual('https://example.com/');
    expect(req.method).toEqual('GET');
    expect(req instanceof NextRequest).toEqual(true);
  });

  it('should assign extra properties to the CustomRequest instance', () => {
    const url = new URL('https://example.com');
    const init: CustomRequestInit = {
      params: { id: '123' },
      query: { search: 'test' },
      payload: { data: 'sample' },
      session: { user: 'john_doe' },
    };
    const req = new CustomRequest(url, init);

    expect(req.params).toEqual({ id: '123' });
    expect(req.query).toEqual({ search: 'test' });
    expect(req.payload).toEqual({ data: 'sample' });
    expect(req.session).toEqual({ user: 'john_doe' });
  });

  it('should handle cases where init is undefined', () => {
    const url = new URL('https://example.com');
    const req = new CustomRequest(url);

    expect(req.params).toBeUndefined();
    expect(req.query).toBeUndefined();
    expect(req.payload).toBeUndefined();
    expect(req.session).toBeUndefined();
  });
});
