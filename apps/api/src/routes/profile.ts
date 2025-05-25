import {
  CollectionNotFoundError,
  NotOwnerOfCollectionError,
  TagNotFoundError,
  UsernameExistsError,
  WrongPasswordError,
} from "@repo/core/services";
import { Id } from "@repo/core/utils";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import {
  makeCollectionDto,
  makeReviewDto,
  makeUserDto,
  withPaginatedData,
} from "../utils/make-dto";
import { validator } from "../utils/validator";
import { raise } from "@repo/core/sdk";

export const profileRoute = new Hono()
  .use(authMiddleware)
  .get("", async (c) => {
    const session = c.get("session")!;
    return c.json({ user: makeUserDto(session.user) });
  })
  .get(
    "/collections",
    validator(
      "query",
      z.object({
        search: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const session = c.get("session")!;
      const { limit, cursor, search } = c.req.valid("query");
      const collectionService = c.get("collectionService");

      const result = await collectionService.getUserCollections({
        userId: session.user.id,
        limit,
        cursor,
        search,
        by: session.user.id,
      });

      return c.json({
        collections: withPaginatedData(makeCollectionDto)(result.unwrap()),
      });
    }
  )
  .patch(
    "",
    validator(
      "json",
      z.object({
        username: z.string().optional(),
        description: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        password: z
          .object({
            old: z.string(),
            new: z.string(),
          })
          .optional(),
      })
    ),
    async (c) => {
      const session = c.get("session")!;
      const { description, imageUrl, password, username } = c.req.valid("json");
      const userService = c.get("userService");

      const updatedUserResult = await userService.updateUser({
        id: session.user.id,
        data: {
          description,
          imageUrl,
          username,
          password,
        },
      });

      if (updatedUserResult.isErr()) {
        const error = updatedUserResult.unwrapErr();
        if (error instanceof UsernameExistsError) {
          return c.json({ error: "USERNAME_EXISTS" as const }, 409);
        }

        if (error instanceof WrongPasswordError) {
          return c.json({ error: "OLD_PASSWORD_INCORRECT" as const }, 401);
        }

        throw error;
      }

      return c.json({ user: makeUserDto(updatedUserResult.unwrap()) }, 200);
    }
  )
  .post(
    "/personal-collection/merge",
    validator(
      "json",
      z.object({
        collectionId: z.number().int().positive(),
        assignTagsIds: z.array(z.number().int().positive()).optional(),
      })
    ),
    authMiddleware,
    async (c) => {
      const user = c.get("session")!.user;
      const collectionService = c.get("collectionService");
      const { collectionId, assignTagsIds = [] } = c.req.valid("json");

      const fillResult =
        await collectionService.fillPersonalCollectionWithOtherCollection({
          userId: user.id,
          collectionId: new Id(collectionId),
          tagsIds: assignTagsIds.map((tId) => new Id(tId)),
        });

      if (fillResult.isErr()) {
        const error = fillResult.error;

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof TagNotFoundError) {
          return c.json({ error: "TAG_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 409);
        }
      }

      const { addedReviews, conflictReviews } = fillResult.unwrap();

      return c.json(
        {
          addedReviews: addedReviews.map(makeReviewDto),
          conflictReviews: conflictReviews.map(makeReviewDto),
        },
        200
      );
    }
  )
  .get("/personal-collection", async (c) => {
    const {
      user: { id },
    } = c.get("session")!;
    const collectionService = c.get("collectionService");

    const collectionResult =
      await collectionService.getOrCreatePersonalCollection({
        userId: id,
        by: id,
      });

    const collection = collectionResult.unwrap();

    return c.json({ collection: makeCollectionDto(collection) }, 200);
  })
  .get("/to-watch-collection", async (c) => {
    const {
      user: { id },
    } = c.get("session")!;
    const collectionService = c.get("collectionService");

    const collectionResult =
      await collectionService.getOrCreateToWatchCollection({
        userId: id,
        by: id,
      });

    const collection = collectionResult.unwrap();

    return c.json({ collection: makeCollectionDto(collection) }, 200);
  })
  .post(
    "/to-watch-collection/merge",
    validator(
      "json",
      z.object({
        collectionId: z.number().int().positive(),
        assignTagsIds: z.array(z.number().int().positive()).optional(),
        isWatchedCriteria: z
          .array(z.enum(["score", "description"]))
          .min(1)
          .max(2),
      })
    ),
    authMiddleware,
    async (c) => {
      const user = c.get("session")!.user;
      const collectionService = c.get("collectionService");
      const {
        collectionId,
        assignTagsIds = [],
        isWatchedCriteria,
      } = c.req.valid("json");

      const hasScoreCriteria = isWatchedCriteria.includes("score");
      const hasDescCriteria = isWatchedCriteria.includes("description");

      const fillResult =
        await collectionService.fillToWatchCollectionWithOtherCollection({
          userId: user.id,
          collectionId: new Id(collectionId),
          tagsIds: assignTagsIds.map((tId) => new Id(tId)),
          isWatchedCriteria:
            hasScoreCriteria && hasDescCriteria
              ? "score_desc"
              : hasScoreCriteria
                ? "score"
                : hasDescCriteria
                  ? "desc"
                  : raise(
                      "Have neither score and desc criteria? Something bad happenned"
                    ),
        });

      if (fillResult.isErr()) {
        const error = fillResult.error;

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof TagNotFoundError) {
          return c.json({ error: "TAG_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 409);
        }
      }

      const { addedReviews, conflictReviews, watched } = fillResult.unwrap();

      return c.json(
        {
          addedReviews: addedReviews.map(makeReviewDto),
          conflictReviews: conflictReviews.map(makeReviewDto),
          watched,
        },
        200
      );
    }
  );
