import { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler<
  {},
  string,
  {
    in: {};
    out: {};
  }
> = async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }

  return next();
};
