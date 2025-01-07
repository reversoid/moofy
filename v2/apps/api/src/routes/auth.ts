import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { deleteCookie, getCookie, setSignedCookie } from "hono/cookie";
import config from "@repo/config";

export const authRoute = new Hono()
  .post(
    "/auth/login",
    validator(
      "json",
      z.object({
        username: z.string(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const userService = c.get("userService");
      const sessionService = c.get("sessionService");

      const user = await userService.validateUserAndPassword(
        username,
        password
      );
      if (!user) {
        return c.json({ error: "Invalid credentials" }, 401);
      }

      const token = sessionService.generateSessionToken();
      const session = await sessionService.createSession(token, user);

      await setSignedCookie(c, "session", config.COOKIE_SECRET, session.id, {
        httpOnly: true,
        secure: config.ENV !== "development",
        sameSite: "Lax",
      });

      return c.json({ user: session.user });
    }
  )
  .post(
    "/auth/register",
    validator(
      "json",
      z.object({
        username: z.string(),
        password: z.string().min(8),
      })
    ),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const userService = c.get("userService");
      const sessionService = c.get("sessionService");

      const createResult = await userService.createUser(username, password);

      if (!createResult.isOk()) {
        return c.json({ error: createResult.error.message }, 400);
      }

      const token = sessionService.generateSessionToken();
      const session = await sessionService.createSession(
        token,
        createResult.value
      );

      await setSignedCookie(c, "session", config.COOKIE_SECRET, session.id, {
        httpOnly: true,
        secure: config.ENV !== "development",
        sameSite: "Lax",
        expires: session.expiresAt,
      });

      return c.json({ user: session.user });
    }
  )
  .post("/auth/logout", async (c) => {
    const sessionToken = getCookie(c, "session");
    const sessionService = c.get("sessionService");

    if (sessionToken) {
      await sessionService.invalidateSession(sessionToken);

      deleteCookie(c, "session");
    }
  });
