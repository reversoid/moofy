import ky, { Options } from 'ky';
import { setAppError } from '@/features/app';
import { tokenService } from '../services/token.service';
import environment from '@/app/environment';
import { AuthResponse } from './types/authResponse.type';

interface CustomOptions extends Options {
  /** With this option enabled all logic about JWT tokens on client is proceeded automatically */
  useJWT?: boolean;
}

type HttpMethods = 'get' | 'post' | 'patch' | 'delete';

/** This base class provides apiUrl and fetch methods with JWT support*/
export default class ApiService {
  protected apiUrl =  environment.apiUrl;

  protected async post<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: CustomOptions,
  ) {
    return this.fetch<Response>(this.apiUrl + relativeUrl, 'post', options);
  }

  protected async get<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: CustomOptions,
  ) {
    return this.fetch<Response>(this.apiUrl + relativeUrl, 'get', options);
  }

  protected async patch<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: CustomOptions,
  ) {
    return this.fetch<Response>(this.apiUrl + relativeUrl, 'patch', options);
  }

  protected async delete<Response = unknown>(
    relativeUrl: `/${string}`,
    options?: CustomOptions,
  ) {
    return this.fetch<Response>(this.apiUrl + relativeUrl, 'delete', options);
  }

  private async fetch<Response = unknown>(
    url: string,
    method: HttpMethods,
    options?: CustomOptions,
  ) {
    if (!options?.useJWT) {
      return this._fetchWithRetry<Response>(url, method, options);
    }

    try {
      return await this._fetchWithJWT<Response>(url, method, options);
    } catch (error: any) {
      if (error.cause?.statusCode !== 401) {
        throw error;
      }
      return this._checkoutAndFetch<Response>(url, method, options);
    }
  }

  /** Gets access token from localstorage and sends it with request */
  private async _fetchWithJWT<Response = unknown>(
    url: string,
    method: HttpMethods,
    options?: Options,
  ): Promise<Response> {
    const token = tokenService.getAccessToken() ?? '';
    const optionsWithToken = {
      ...(options ?? {}),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return this._fetchWithRetry<Response>(url, method, optionsWithToken);
  }

  /** Gets new access+refresh tokens and sends the request */
  private async _checkoutAndFetch<Response = unknown>(
    url: string,
    method: HttpMethods,
    options?: Options,
  ): Promise<Response> {
    const { access_token } = await this._fetchWithRetry<AuthResponse>(
      this.apiUrl + '/auth/protected/checkout',
      'get',
    );
    tokenService.setAccessToken(access_token);

    const optionsWithNewToken: Options = {
      ...(options ?? {}),
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    return this._fetchWithRetry<Response>(url, method, optionsWithNewToken);
  }

  /** Provides retries for some http error responses*/
  private async _fetchWithRetry<Response = unknown>(
    url: string,
    method: HttpMethods,
    options?: Options,
  ): Promise<Response> {
    try {
      return await ky(url, {
        retry: {
          limit: 4,
          methods: ['post', 'get', 'patch', 'delete'],
          statusCodes: [408, 413, 429, 502, 503, 504],
          backoffLimit: 200,
        },
        credentials: 'include',
        method,
        ...options,
      }).json<Response>();
    } catch (error: any) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setAppError(errorJson.message ?? 'NETWORK_ERROR');
        throw new Error('Http Error', { cause: errorJson });
      }
      setAppError('NETWORK_ERROR');
      throw new Error('Unknown Http Error', { cause: error });
    }
  }
}
