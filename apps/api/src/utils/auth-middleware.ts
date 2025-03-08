import { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get("session");

  if (!user) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }

  return next();
};
