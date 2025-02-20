import { MiddlewareHandler } from "hono";
import { Entity } from "@repo/core/entities";

export class EntityReturnedError extends Error {
  constructor(path: string, method: string) {
    super(
      `The entity is returned in '${path}' '${method}' method. Apply 'makeDto' to the response`
    );
  }
}

/** Recursively checks if a value contains any Entity instances */
function containsEntity(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (value instanceof Entity) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) => containsEntity(item));
  }

  if (typeof value === "object") {
    return Object.values(value).some((item) => containsEntity(item));
  }

  return false;
}

/** Checks if the response does not contain entities, otherwise throws an error */
export const withEntityCheck = (): MiddlewareHandler => async (c, next) => {
  const originalJson = c.json.bind(c);

  c.json = function (data: any, ...args: any[]) {
    if (containsEntity(data)) {
      throw new EntityReturnedError(c.req.path, c.req.method);
    }

    return originalJson(data, ...args);
  };

  await next();
};
