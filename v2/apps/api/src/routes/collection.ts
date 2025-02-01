import {
  CollectionNotFoundError,
  FilmNotFoundError,
  NoAccessToCollectionError,
  NoAccessToPrivateCollectionError,
  NotOwnerOfCollectionError,
  ReviewOnFilmExistsError,
} from "@repo/core/services";
import { Id } from "@repo/core/utils";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import { makeDto } from "../utils/make-dto";
import { validator } from "../utils/validator";

export const collectionRoute = new Hono()
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
      const collectionService = c.get("collectionService");

      const collections = await collectionService.searchPublicCollections({
        search,
        limit,
      });

      return c.json(makeDto({ collections }));
    }
  )
  .post(
    "/collections",
    authMiddleware,
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
      const user = c.get("user")!;
      const { name, description, imageUrl, isPublic } = c.req.valid("json");
      const collectionService = c.get("collectionService");

      const result = await collectionService.createCollection({
        userId: user.id,
        dto: {
          name,
          description: description ?? undefined,
          imageUrl: imageUrl ?? undefined,
          isPublic,
        },
      });

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

      const collectionResult = await collectionService.getCollection({
        id: new Id(id),
        by: user?.id,
      });

      if (collectionResult.isErr()) {
        const error = collectionResult.unwrapErr();

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const collection = collectionResult.unwrap();

      if (!collection) {
        return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
      }

      return c.json(makeDto({ collection }));
    }
  )
  .delete(
    "/collections/:id",
    authMiddleware,
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const user = c.get("user")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.removeCollection({
        id: new Id(id),
        by: user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      return c.body(null, 204);
    }
  )
  .patch(
    "/collections/:id",
    authMiddleware,
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
      const user = c.get("user")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.editCollection({
        id: new Id(id),
        by: user.id,
        dto: updateData,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
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
      const user = c.get("user");

      const { collectionId } = c.req.valid("param");
      const { limit, cursor, search } = c.req.valid("query");

      const reviewService = c.get("reviewService");

      if (search) {
        const result = await reviewService.searchReviews({
          search,
          collectionId: new Id(collectionId),
          limit,
          by: user?.id,
        });

        if (result.isErr()) {
          const error = result.unwrapErr();
          if (error instanceof CollectionNotFoundError) {
            return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
          }

          if (error instanceof NoAccessToPrivateCollectionError) {
            return c.json({ error: "FORBIDDEN" as const }, 403);
          }

          throw error;
        }

        const reviews = result.unwrap();

        return c.json(
          makeDto({
            reviews: {
              items: reviews,
              cursor: null,
            },
          })
        );
      } else {
        const result = await reviewService.getCollectionReviews({
          collectionId: new Id(collectionId),
          limit,
          cursor,
          by: user?.id,
        });

        if (result.isErr()) {
          const error = result.unwrapErr();
          if (error instanceof CollectionNotFoundError) {
            return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
          }

          if (error instanceof NoAccessToPrivateCollectionError) {
            return c.json({ error: "FORBIDDEN" as const }, 403);
          }

          throw error;
        }

        const reviews = result.unwrap();
        return c.json(makeDto({ reviews }));
      }
    }
  )
  .post(
    "/collections/:collectionId/reviews",
    authMiddleware,
    validator(
      "json",
      z.object({
        score: z.number().int().min(1).max(10).nullish(),
        description: z.string().min(1).max(1000).nullish(),
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
      const user = c.get("user")!;

      const reviewService = c.get("reviewService");

      const result = await reviewService.createReview({
        collectionId: new Id(collectionId),
        by: user.id,
        dto: {
          filmId: String(filmId),
          score: score ?? undefined,
          description: description ?? undefined,
        },
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof FilmNotFoundError) {
          return c.json({ error: "FILM_NOT_FOUND" as const }, 400);
        }

        if (error instanceof ReviewOnFilmExistsError) {
          return c.json({ error: "REVIEW_ON_FILM_EXISTS" as const }, 409);
        }

        if (error instanceof NoAccessToCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const review = result.unwrap();
      return c.json(makeDto({ review }), 201);
    }
  );
