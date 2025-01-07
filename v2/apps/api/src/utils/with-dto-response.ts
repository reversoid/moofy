import { MiddlewareHandler } from "hono";
import { makeDto } from "./make-dto";

export const withDtoResponse = (): MiddlewareHandler => async (c, next) => {
  const originalJson = c.json.bind(c);

  c.json = function (data: any, ...args: any[]) {
    return originalJson(makeDto(data) as any, ...args);
  };

  await next();
};
