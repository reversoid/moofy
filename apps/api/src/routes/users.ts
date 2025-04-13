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
import { authMiddleware } from "../utils/auth-middleware";
import {
  makeCollectionDto,
  makeReviewDto,
  makeUserDto,
  withPaginatedData,
} from "../utils/make-dto";

export const userRoute = new Hono()
  .put(
    "/:id/followers",
    authMiddleware,
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const session = c.get("session")!;
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.follow({
        fromUserId: session.user.id,
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

      return c.body(null, 204);
    }
  )
  .get(
    "/:id/followers",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
        search: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const session = c.get("session");

      const { limit, cursor, search } = c.req.valid("query");
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.getFollowers({
        userId: new Id(id),
        limit,
        cursor,
        search,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      const users = result.unwrap();

      const isFollowingMany = await subscriptionService.isFollowingMany({
        fromUserId: session?.user?.id,
        toUserIds: users.items.map((user) => user.id),
      });

      return c.json({
        users: {
          cursor: users.cursor,
          items: users.items.map((u, index) => ({
            user: makeUserDto(u),
            isFollowing: isFollowingMany[index].isFollowing,
          })),
        },
      });
    }
  )
  .get(
    "/:id/followees",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
        search: z.string().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const session = c.get("session");
      const { limit, cursor, search } = c.req.valid("query");
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.getFollowees({
        userId: new Id(id),
        limit,
        cursor,
        search,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }
      const users = result.unwrap();

      const isFollowingMany = await subscriptionService.isFollowingMany({
        fromUserId: session?.user?.id,
        toUserIds: users.items.map((user) => user.id),
      });

      return c.json({
        users: {
          cursor: users.cursor,
          items: users.items.map((u, index) => ({
            user: makeUserDto(u),
            isFollowing: isFollowingMany[index].isFollowing,
          })),
        },
      });
    }
  )
  .delete(
    "/:id/followers",
    authMiddleware,
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const session = c.get("session")!;
      const subscriptionService = c.get("subscriptionService");

      const result = await subscriptionService.unfollow({
        fromUserId: session.user.id,
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

      return c.body(null, 204);
    }
  )
  .get("/existence/:username", async (c) => {
    const { username } = c.req.param();
    const userService = c.get("userService");
    const user = await userService.getUserByUsername(username);
    return c.json({ exists: user !== null });
  })
  .get(
    "",
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
      const session = c.get("session")!;

      const userService = c.get("userService");
      const subscriptionService = c.get("subscriptionService");

      const users = await userService.searchUsers({ search, limit });

      const isFollowingMany = await subscriptionService.isFollowingMany({
        fromUserId: session.user.id,
        toUserIds: users.map((user) => user.id),
      });

      return c.json({
        users: users.map((u, index) => ({
          user: makeUserDto(u),
          isFollowing: isFollowingMany[index].isFollowing,
        })),
      });
    }
  )
  .get(
    "/:username",
    validator("param", z.object({ username: z.string() })),
    async (c) => {
      const { username } = c.req.valid("param");
      const userService = c.get("userService");
      const currentUser = c.get("session")?.user;

      const user = await userService.getUserByUsername(username);

      if (!user) {
        return c.json({ error: "USER_NOT_FOUND" as const }, 404);
      }

      const subscriptionService = c.get("subscriptionService");

      const [isFollowing, { followersAmount, followeesAmount }] =
        await Promise.all([
          subscriptionService.isFollowing({
            fromUserId: currentUser?.id,
            toUserId: user.id,
          }),
          subscriptionService.getSocialStats({ userId: user.id }),
        ]);

      return c.json(
        {
          user: makeUserDto(user),
          isFollowing,
          followersAmount,
          followeesAmount,
        },
        200
      );
    }
  )
  .get(
    "/:id/collections",
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
      const session = c.get("session");

      const { limit, cursor, search } = c.req.valid("query");

      const collectionService = c.get("collectionService");

      const collections = await collectionService.getUserCollections({
        userId: new Id(id),
        limit,
        cursor,
        search,
        by: session?.user?.id,
      });

      if (collections.isErr()) {
        const error = collections.unwrapErr();
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.json({
        collections: withPaginatedData(makeCollectionDto)(collections.unwrap()),
      });
    }
  )
  .get(
    "/:id/personal-collection",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const collectionService = c.get("collectionService");

      const collectionResult =
        await collectionService.getOrCreatePersonalCollection({
          userId: new Id(userId),
        });

      if (collectionResult.isErr()) {
        const error = collectionResult.error;
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      const collection = collectionResult.value;

      return c.json({ collection: makeCollectionDto(collection) }, 200);
    }
  )
  .get(
    "/:id/personal-collection/reviews",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "query",
      z.object({
        cursor: z.string().optional(),
        search: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
      })
    ),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const { limit, cursor, search } = c.req.valid("query");

      const collectionService = c.get("collectionService");
      const reviewService = c.get("reviewService");

      const user = c.get("session")?.user;

      const collectionResult =
        await collectionService.getOrCreatePersonalCollection({
          userId: new Id(userId),
        });

      if (collectionResult.isErr()) {
        const error = collectionResult.error;
        if (error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      const collection = collectionResult.value;

      const reviewsResult = await reviewService.getCollectionReviews({
        collectionId: collection.id,
        limit,
        cursor,
        by: user?.id,
        search,
      });

      const reviews = reviewsResult.unwrap();

      return c.json(
        { reviews: withPaginatedData(makeReviewDto)(reviews) },
        200
      );
    }
  );
