import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { deleteCookie, getCookie, setSignedCookie } from "hono/cookie";
import config from "@repo/config";
import { UsernameExistsError } from "@repo/core/services";
import { makeUserDto } from "../utils/make-dto";

export const authRoute = new Hono()
  .post(
    "/login",
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

      const userResult = await userService.validateUsernameAndPassword({
        username,
        password,
      });

      if (userResult.isErr()) {
        return c.json({ error: "INVALID_CREDENTIALS" as const }, 401);
      }

      const user = userResult.unwrap();

      const token = sessionService.generateSessionToken();
      const session = await sessionService.createSession(token, user);

      await setSignedCookie(c, "session", token, config.COOKIE_SECRET, {
        httpOnly: true,
        secure: config.ENV === "production" || config.ENV === "staging",
        sameSite: "Lax",
        path: "/",
        expires: session.expiresAt,
      });

      return c.json({ user: makeUserDto(session.user) });
    }
  )
  .post(
    "/register",
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

      const createResult = await userService.createUser({
        username,
        password,
      });

      if (createResult.isErr()) {
        const error = createResult.unwrapErr();

        if (error instanceof UsernameExistsError) {
          return c.json({ error: "USERNAME_EXISTS" as const }, 400);
        }

        throw error;
      }

      const newUser = createResult.unwrap();

      const token = sessionService.generateSessionToken();
      const session = await sessionService.createSession(token, newUser);

      await setSignedCookie(c, "session", token, config.COOKIE_SECRET, {
        httpOnly: true,
        secure: config.ENV === "production" || config.ENV === "staging",
        sameSite: "Lax",
        path: "/",
        expires: session.expiresAt,
      });

      return c.json({ user: makeUserDto(session.user) });
    }
  )
  .post("/logout", async (c) => {
    const sessionToken = getCookie(c, "session");
    const sessionService = c.get("sessionService");

    if (sessionToken) {
      await sessionService.invalidateSession(sessionToken);

      deleteCookie(c, "session");
    }

    return c.body(null, 204);
  });
