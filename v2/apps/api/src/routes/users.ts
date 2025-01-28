import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import { Id } from "@repo/core/utils";
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  NotFollowingError,
} from "@repo/core/services";
import { UserNotFoundError } from "@repo/core/services";
import { makeDto } from "../utils/make-dto";

export const userRoute = new Hono()
  .use(authMiddleware)
  .put(
    "/users/:id/followers",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const subscriptionService = c.get("subscriptionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await subscriptionService.follow(user.id, new Id(id));

      if (!result.isOk()) {
        const error = result.unwrapErr();
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" }, 404);
        }
        if (error instanceof AlreadyFollowingError) {
          return c.json({ error: "ALREADY_FOLLOWING" }, 400);
        }
        if (error instanceof CannotFollowSelfError) {
          return c.json({ error: "CANNOT_FOLLOW_SELF" }, 400);
        }
      }

      return c.json(makeDto({ user: result.unwrap() }));
    }
  )
  .get(
    "/users/:id/followers",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { limit, cursor } = c.req.valid("query");
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.getFollowers(
        new Id(id),
        limit,
        cursor
      );

      if (!result.isOk()) {
        return c.json({ error: "USER_NOT_FOUND" }, 404);
      }

      return c.json(makeDto({ users: result.unwrap() }));
    }
  )
  .get(
    "/users/:id/followees",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { limit, cursor } = c.req.valid("query");
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.getFollowees(
        new Id(id),
        limit,
        cursor
      );

      if (!result.isOk()) {
        return c.json({ error: "USER_NOT_FOUND" }, 404);
      }

      return c.json(makeDto({ users: result.unwrap() }));
    }
  )
  .delete(
    "/users/:id/followers",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const subscriptionService = c.get("subscriptionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await subscriptionService.unfollow(user.id, new Id(id));

      if (!result.isOk()) {
        const error = result.unwrapErr();
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" }, 404);
        }

        if (error instanceof NotFollowingError) {
          return c.json({ error: "NOT_FOLLOWING" }, 400);
        }
      }

      return c.json(makeDto({ user: result.unwrap() }));
    }
  )
  .get("/users/existence/:username", async (c) => {
    const { username } = c.req.param();
    const userService = c.get("userService");
    const user = await userService.getUserByUsername(username);
    return c.json({ exists: user !== null });
  })
  .get(
    "/users",
    validator(
      "query",
      z.object({
        search: z.string().default(""),
        limit: z.coerce.number().int().min(1).max(100).default(20),
      })
    ),
    async (c) => {
      const { search, limit } = c.req.valid("query");
      const userService = c.get("userService");

      const users = await userService.searchUsers(search, limit);

      return c.json(makeDto({ users }));
    }
  );
