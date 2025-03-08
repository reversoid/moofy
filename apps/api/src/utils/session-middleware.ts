import config from "@repo/config";
import { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";

/** Adds session to each request using auth token */
export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionService = c.get("sessionService");

  const sessionToken = await getSignedCookie(
    c,
    config.COOKIE_SECRET,
    "session"
  );

  if (!sessionToken) {
    c.set("session", undefined);
    return next();
  }

  const session = await sessionService.validateAndExtendSession(sessionToken);

  if (!session.isOk()) {
    c.set("session", undefined);
    return next();
  }

  c.set("session", session.unwrap());

  return next();
};
