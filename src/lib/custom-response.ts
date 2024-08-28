/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { BodyInit, CookieOptions, ResponseInit } from '../interfaces';

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
   * The following method is used to set a cookie in the response header.
   * It takes advantage of method overloading to provide different options for setting cookies.
   * @param name The name of the cookie.
   * @param val The value of the cookie.
   * @param options The options for the cookie.
   * @returns The current instance of the CustomResponse object.
   */
  cookie(name: string, val: string, options: CookieOptions): this;
  cookie(name: string, val: any, options: CookieOptions): this;
  cookie(name: string, val: any): this;

  cookie(name: string, val: any, options?: CookieOptions): this {
    // Apply the encoding function if provided, otherwise use the value as is.
    const encodedValue = options?.encode ? options.encode(val) : val;

    // Start constructing the cookie string
    let cookieString = `${name}=${encodeURIComponent(encodedValue)}`;

    // Handle cookie options
    if (options) {
      if (options.maxAge) {
        cookieString += `; Max-Age=${options.maxAge}`;
      }
      if (options.signed) {
        cookieString += `; Signed`;
      }
      if (options.expires) {
        cookieString += `; Expires=${options.expires.toUTCString()}`;
      }
      if (options.httpOnly) {
        cookieString += `; HttpOnly`;
      }
      if (options.path) {
        cookieString += `; Path=${options.path}`;
      }
      if (options.domain) {
        cookieString += `; Domain=${options.domain}`;
      }
      if (options.secure) {
        cookieString += `; Secure`;
      }
      if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`;
      }
    }

    this.setHeader('Set-Cookie', cookieString);
    return this;
  }

  /**
   * The following method is used to clear a cookie in the response header.
   * @param name The name of the cookie to clear.
   * @param options The options for the cookie.
   * @returns The current instance of the CustomResponse object.
   */
  clearCookie(name: string, options?: CookieOptions): this {
    const opts = {
      ...options,
      expires: new Date(1), // Set the cookie expiration to a past date
      path: options?.path || '/', // Default path to '/'
      maxAge: undefined, // Ensure maxAge is cleared
    };

    // Call the existing cookie method with an empty value to clear it
    return this.cookie(name, '', opts);
  }

  /**
   * The following method is used to redirect the response to a different URL.
   * It defaults to a 302 status code unless otherwise specified.
   * @param url The URL to redirect to.
   * @param statusCode The status code to use for the redirect.
   * @returns CustomResponse
   *
   * @example
   * response.redirect('https://example.com/new-url');
   * response.redirect(301, 'https://example.com/new-url');
   */
  redirect(url: string): CustomResponse<unknown>;
  redirect(statusCode: number, url: string): CustomResponse<unknown>;

  redirect(statusCodeOrUrl: number | string, maybeUrl?: string) {
    let url: string;
    let statusCode = 302; // Default to 302

    if (typeof statusCodeOrUrl === 'string') {
      url = statusCodeOrUrl;
    } else {
      statusCode = statusCodeOrUrl;
      url = maybeUrl!;
    }

    // Validate that the status code is a valid 3xx code for redirects
    if (statusCode < 300 || statusCode >= 400) {
      statusCode = 302; // Default to 302 if invalid
    }

    // Set the "Location" header for redirection
    this.setHeader('Location', url);

    // Use Next.js's NextResponse.redirect method for handling redirects
    return NextResponse.redirect(url, statusCode);
  }

  /**
   * The following method is used to send the response.
   * It defaults to a 200 status code unless otherwise specified.
   * @param body The body of the response.
   * @returns A CustomResponse object.
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
    return response as CustomResponse<TResponseData>;
  }

  /**
   * The following method sends a response with no body.
   * @returns A CustomResponse object.
   */
  end() {
    // Finalize the response without a body
    return this.send();
  }
}
