import config from "@repo/config";
import { MiddlewareHandler } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";

/** Prolongs session cookie if needed */
export const sessionCookieMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionService = c.get("sessionService");

  const session = c.get("session");

  const sessionToken = await getSignedCookie(
    c,
    config.COOKIE_SECRET,
    "session"
  );

  if (!session || !sessionToken) {
    return next();
  }

  setSignedCookie(c, "session", sessionToken, config.COOKIE_SECRET, {
    httpOnly: true,
    secure: config.ENV === "production" || config.ENV === "staging",
    sameSite: "Lax",
    path: "/",
    expires: session.expiresAt,
  });

  return next();
};
