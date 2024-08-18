/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomResponse } from '../../src';

describe('CustomResponse', () => {
  it('should create an instance of CustomResponse with default status code 200', () => {
    const response = new CustomResponse();

    expect(response instanceof CustomResponse).toEqual(true);
    expect(response.status).toEqual(200);
  });

  it('should set the status code correctly using statusCode()', () => {
    const response = new CustomResponse();
    const res = response.statusCode(204).send();

    expect(res.status).toEqual(204);
  });

  it('should throw an error if status code is not a number', () => {
    const response = new CustomResponse();

    expect(() => response.statusCode('not-a-number' as any)).toThrow(
      'Status code must be a number',
    );
  });

  it('should throw an error if status code is out of range', () => {
    const response = new CustomResponse();

    expect(() => response.statusCode(99)).toThrow('Status code must be between 100 and 599');
    expect(() => response.statusCode(600)).toThrow('Status code must be between 100 and 599');
  });

  it('should send a response with a JSON body and correct status code', () => {
    const response = new CustomResponse();
    const jsonResponse = response.statusCode(201).send({ success: true });

    expect(jsonResponse.status).toEqual(201);
    expect(jsonResponse.headers.get('Content-Type')).toContain('application/json');
  });

  it('should send a response with null body for 204 No Content status', () => {
    const response = new CustomResponse();
    const noContentResponse = response.statusCode(204).send();

    expect(noContentResponse.status).toEqual(204);
    expect(noContentResponse.body).toEqual(null);
  });

  it('should send a response with null body for 304 Not Modified status', () => {
    const response = new CustomResponse();
    const notModifiedResponse = response.statusCode(304).send();

    expect(notModifiedResponse.status).toEqual(304);
    expect(notModifiedResponse.body).toEqual(null);
  });

  it('should set custom headers on the response', () => {
    const response = new CustomResponse();
    response.headers.set('X-Custom-Header', 'custom-value');

    const jsonResponse = response.send({ success: true });
    expect(jsonResponse.headers.get('X-Custom-Header')).toEqual('custom-value');
  });

  it('should override default Content-Type header', () => {
    const response = new CustomResponse();
    response.headers.set('Content-Type', 'text/plain');

    const jsonResponse = response.send('Plain text response');
    expect(jsonResponse.headers.get('Content-Type')).toEqual('text/plain');
  });

  it('should send an empty response with default status code 200', () => {
    const response = new CustomResponse();
    const defaultResponse = response.send();

    expect(defaultResponse.status).toEqual(200);
    expect(defaultResponse.body).toEqual(null);
  });

  it('should send an empty response with an explicit status code', () => {
    const response = new CustomResponse();
    const emptyResponse = response.statusCode(404).send();

    expect(emptyResponse.status).toEqual(404);
    expect(emptyResponse.body).toEqual(null);
  });
});
