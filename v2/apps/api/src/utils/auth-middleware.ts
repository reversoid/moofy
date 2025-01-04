import config from "@repo/config";
import { MiddlewareHandler } from "hono";
import { getCookie, getSignedCookie } from "hono/cookie";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionService = c.get("sessionService");

  const sessionToken = await getSignedCookie(
    c,
    config.COOKIE_SECRET,
    "session"
  );

  if (!sessionToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const session = await sessionService.validateSessionToken(sessionToken);

  if (!session.isOk()) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.value.user);

  return next();
};
