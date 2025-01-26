import config from "@repo/config";
import { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";

type AuthMiddlewareResponse = {
  error: "UNAUTHORIZED";
};

export const authMiddleware: MiddlewareHandler<
  {},
  string,
  {
    in: {};
    out: {
      Response: AuthMiddlewareResponse;
    };
  }
> = async (c, next) => {
  const sessionService = c.get("sessionService");

  const sessionToken = await getSignedCookie(
    c,
    config.COOKIE_SECRET,
    "session"
  );

  if (!sessionToken) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }

  const session = await sessionService.validateSessionToken(sessionToken);

  if (!session.isOk()) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }

  c.set("user", session.value.user);

  return next();
};
