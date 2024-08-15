import { NextResponse } from 'next/server';

export class CustomResponse<TResponseData = unknown> extends NextResponse {
  private _statusCode: number = 200;

  statusCode(statusCode: number) {
    this._statusCode = statusCode;
    return this;
  }

  send(body: TResponseData) {
    const response = NextResponse.json(body, {
      status: this._statusCode,
      headers: this.headers,
    });

    this.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }
}
