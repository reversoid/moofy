import ky, { Options } from 'ky';

/** This class provides apiUrl of moofy backend */
export default class ApiService {
  protected apiUrl = 'http://localhost:3333';

  protected async post<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return ky.post(this.apiUrl + relativeUrl, options).json<Response>();
  }

  protected async get<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return ky.get(this.apiUrl + relativeUrl, options).json<Response>();
  }

  protected async patch<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return ky.patch(this.apiUrl + relativeUrl, options).json<Response>();
  }

  protected async delete<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: Options,
  ) {
    return ky.delete(this.apiUrl + relativeUrl, options).json<Response>();
  }
}

export interface ApiError {
  message: string;
}
