import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import { z } from "zod";
import { Id, PaginatedData } from "@repo/core/utils";
import {
  CollectionNotFoundError,
  FilmNotFoundError,
  NotOwnerOfReviewError,
  ReviewOnFilmExistsError,
  UserNotFoundError,
} from "@repo/core/services";
import { makeDto } from "../utils/make-dto";
import { Review } from "@repo/core/entities";

export const collectionRoute = new Hono()
  .use(authMiddleware)
  .get(
    "/collections",
    validator(
      "query",
      z.object({
        search: z.string().default(""),
        limit: z.coerce.number().int().min(1).max(100).default(20),
      })
    ),
    async (c) => {
      const { search, limit } = c.req.valid("query");
      const user = c.get("user");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const collections = await collectionService.searchCollections(
        search,
        limit
      );

      return c.json(makeDto({ collections }));
    }
  )
  .post(
    "/collections",
    validator(
      "json",
      z.object({
        name: z.string().min(1),
        description: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        isPublic: z.boolean().default(false),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { name, description, imageUrl, isPublic } = c.req.valid("json");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await collectionService.createCollection({
        userId: user.id,
        name,
        description: description ?? undefined,
        imageUrl: imageUrl ?? undefined,
        isPublic,
      });

      if (!result.isOk()) {
        if (result.error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" }, 404);
        }
      }

      return c.json(makeDto({ collection: result.unwrap() }), 201);
    }
  )
  .get(
    "/collections/:id",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const collection = await collectionService.getCollection(new Id(id));

      if (!collection) {
        return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
      }

      if (
        !collection.isPublic &&
        collection.creator.id.value !== user.id.value
      ) {
        return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
      }

      return c.json(makeDto({ collection }));
    }
  )
  .delete(
    "/collections/:id",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await collectionService.removeCollection(
        new Id(id),
        user.id
      );

      if (!result.isOk()) {
        if (result.error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
        }

        if (result.error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" }, 403);
        }
      }

      return c.body(null, 204);
    }
  )
  .patch(
    "/collections/:id",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    validator(
      "json",
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        isPublic: z.boolean().optional(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const updateData = c.req.valid("json");
      const user = c.get("user");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await collectionService.editCollection(
        new Id(id),
        updateData,
        user.id
      );

      if (!result.isOk()) {
        if (result.error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
        }

        if (result.error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" }, 403);
        }
      }

      return c.json(makeDto({ collection: result.unwrap() }));
    }
  )
  .get(
    "/collections/:collectionId/reviews",
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        cursor: z.string().optional(),
      })
    ),
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { limit, cursor, search } = c.req.valid("query");

      const reviewService = c.get("reviewService");

      if (search) {
        const result = await reviewService.searchReviews(
          search,
          new Id(collectionId),
          limit
        );

        if (result.isErr()) {
          const error = result.unwrapErr();
          if (error instanceof CollectionNotFoundError) {
            return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
          }
        }

        return c.json(
          makeDto({
            reviews: {
              items: result.unwrap(),
              cursor: null,
            },
          })
        );
      } else {
        const result = await reviewService.getCollectionReviews(
          new Id(collectionId),
          limit,
          cursor
        );

        if (result.isErr()) {
          const error = result.unwrapErr();
          if (error instanceof CollectionNotFoundError) {
            return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
          }
        }

        const reviews = result.unwrap();
        return c.json(makeDto({ reviews }));
      }
    }
  )
  .post(
    "/collections/:collectionId/reviews",
    validator(
      "json",
      z.object({
        score: z.number().int().min(1).max(10),
        description: z.string().min(1).max(1000),
        filmId: z.coerce.number().int().positive(),
      })
    ),
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { score, description, filmId } = c.req.valid("json");
      const user = c.get("user");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const reviewService = c.get("reviewService");

      const result = await reviewService.createReview(
        {
          score,
          description,
          collectionId: new Id(collectionId),
          filmId: String(filmId),
        },
        user.id
      );

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
        }

        if (error instanceof FilmNotFoundError) {
          return c.json({ error: "FILM_NOT_FOUND" }, 404);
        }

        if (error instanceof ReviewOnFilmExistsError) {
          return c.json({ error: "REVIEW_ON_FILM_EXISTS" }, 409);
        }

        if (error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" }, 403);
        }
      }

      const review = result.unwrap();
      return c.json(makeDto({ review }), 201);
    }
  );
