import config from "@repo/config";
import { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";

/** Adds user to each request using auth token */
export const userMiddleware: MiddlewareHandler<
  {},
  string,
  {
    in: {};
    out: {};
  }
> = async (c, next) => {
  const sessionService = c.get("sessionService");

  const sessionToken = await getSignedCookie(
    c,
    config.COOKIE_SECRET,
    "session"
  );

  if (!sessionToken) {
    c.set("user", undefined);
    return next();
  }

  const session = await sessionService.validateSessionToken(sessionToken);

  if (!session.isOk()) {
    c.set("user", undefined);
    return next();
  }

  c.set("user", session.value.user);
  // return c.json({ error: "UNAUTHORIZED" }, 401);

  return next();
};
