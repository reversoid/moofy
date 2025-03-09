import { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = c.get("session");

  if (!session) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }

  return next();
};
