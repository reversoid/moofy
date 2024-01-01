import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { REFRESH_TOKEN_KEY } from '../utils/refresh-token-key';

export type FastifyRequestWithRefresh = FastifyRequest & {
  refresh?: string;
};

/**
 * Checks whether user has set refresh token in cookie.
 *
 * Adds field "refresh" with refresh token to request
 */
export class HasRefreshGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest() as FastifyRequestWithRefresh;

    const unsignResult = request.unsignCookie(
      request.cookies[REFRESH_TOKEN_KEY] ?? '',
    );

    if (unsignResult.valid && unsignResult.value) {
      request.refresh = unsignResult.value;
      return unsignResult.valid;
    }

    throw new BadRequestException();
  }
}
