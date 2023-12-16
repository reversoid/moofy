import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequestWithRefresh } from '../guards/has-refresh-token.guard';

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest() as FastifyRequestWithRefresh;

    return request.refresh;
  },
);
