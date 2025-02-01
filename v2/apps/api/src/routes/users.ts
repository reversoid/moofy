import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { Id } from "@repo/core/utils";
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  NotFollowingError,
} from "@repo/core/services";
import { UserNotFoundError } from "@repo/core/services";
import { makeDto } from "../utils/make-dto";
import { authMiddleware } from "../utils/auth-middleware";

export const userRoute = new Hono()
  .put(
    "/users/:id/followers",
    authMiddleware,
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user")!;
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.follow({
        fromUserId: user.id,
        toUserId: new Id(id),
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        if (error instanceof AlreadyFollowingError) {
          return c.json({ error: "ALREADY_FOLLOWING" as const }, 409);
        }

        if (error instanceof CannotFollowSelfError) {
          return c.json({ error: "CANNOT_FOLLOW_SELF" as const }, 400);
        }
      }

      return c.json({});
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

      const result = await subscriptionService.getFollowers({
        userId: new Id(id),
        limit,
        cursor,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
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

      const result = await subscriptionService.getFollowees({
        userId: new Id(id),
        limit,
        cursor,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.json(makeDto({ users: result.unwrap() }));
    }
  )
  .delete(
    "/users/:id/followers",
    authMiddleware,
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user")!;
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.unfollow({
        fromUserId: user.id,
        toUserId: new Id(id),
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotFollowingError) {
          return c.json({ error: "NOT_FOLLOWING" as const }, 400);
        }
      }

      return c.json({});
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
    authMiddleware,
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

      const users = await userService.searchUsers({ search, limit });

      return c.json(makeDto({ users }));
    }
  )
  .get(
    "/users/:username",
    validator("param", z.object({ username: z.string() })),
    async (c) => {
      const { username } = c.req.valid("param");
      const userService = c.get("userService");
      const user = await userService.getUserByUsername(username);

      if (!user) {
        return c.json({ error: "USER_NOT_FOUND" as const }, 404);
      }

      return c.json(makeDto({ user }));
    }
  )
  .get(
    "/users/:id/collections",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
        search: z.string().default(""),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");

      const { limit, cursor, search } = c.req.valid("query");

      const collectionService = c.get("collectionService");

      const collections = await collectionService.getUserCollections({
        userId: new Id(id),
        limit,
        cursor,
        search,
        by: user?.id,
      });

      if (collections.isErr()) {
        const error = collections.unwrapErr();
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.json(makeDto({ collections: collections.unwrap() }));
    }
  );
