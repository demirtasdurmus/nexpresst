import { NextResponse } from 'next/server';
import { BodyInit, ResponseInit } from '../interfaces';

export class CustomResponse<TResponseData = unknown> extends NextResponse {
  private noBodyStatusCodes = [204, 205, 304];
  /**
   * The following private property is used to store the status code of the response.
   */
  private _statusCode: number = 200;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
  }

  /**
   * This method is used to validate the status code.
   * It throws an error if the status code is not a number or is not between 100 and 599.
   */
  private validateStatusCode(statusCode: number): void {
    if (typeof statusCode !== 'number') {
      throw new TypeError('Status code must be a number');
    }

    if (statusCode < 200 || statusCode > 599) {
      throw new RangeError('Status code must be between 200 and 599');
    }
  }

  /**
   * The following method is used to set the status code of the response.
   * @param statusCode The status code to be set in the response.
   * @returns The current instance of the CustomResponse object.
   */
  statusCode(statusCode: number) {
    this.validateStatusCode(statusCode);

    this._statusCode = statusCode;
    return this;
  }

  /**
   * TODO: Add tests for this method
   * Sets a header on the response object
   * @param name - The name of the header
   * @param value - The value of the header
   * @returns The current instance of the CustomResponse object
   * @example
   * response.setHeader('Content-Type', 'application/json');
   */
  setHeader(name: string, value: string) {
    // Use the headers() method from NextResponse to modify headers
    this.headers.set(name, value);
    return this; // Return `this` for chaining
  }

  /**
   * TODO: Add tests for this method
   * Retrieves a header from the response object
   * @param name - The name of the header
   * @returns The value of the header
   * @example
   * response.getHeader('Content-Type');
   */
  getHeader(name: string): string | null {
    return this.headers.get(name);
  }

  /**
   * TODO: Add tests for this method
   * Removes a header from the response object
   * @param name - The name of the header to remove
   * @returns void
   * @example
   * response.removeHeader('Content-Type');
   */
  removeHeader(name: string): void {
    this.headers.delete(name);
  }

  /**
   * The following method is used to send the response.
   * It defaults to a 200 status code unless otherwise specified.
   * @param body The body of the response.
   * @returns A NextResponse object.
   */
  send(body?: TResponseData) {
    let response: NextResponse;

    // Handle special cases where no body should be sent
    if (this.noBodyStatusCodes.includes(this._statusCode) || !body) {
      // No body response
      response = new NextResponse(null, {
        status: this._statusCode,
      });
    } else {
      // Regular JSON response
      response = NextResponse.json(body, {
        status: this._statusCode,
      });
    }

    // Set headers on the response
    this.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    // TODO: Search for a better way to handle this
    return response as NextResponse<TResponseData>;
  }

  /**
   * The following method sends a response with no body.
   * @returns A NextResponse object.
   */
  end() {
    // Finalize the response without a body
    return this.send();
  }
}
