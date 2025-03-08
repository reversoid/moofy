import {
  AlreadyLikedCollectionError,
  CollectionNotFoundError,
  FilmNotFoundError,
  NoAccessToCollectionError,
  NoAccessToPrivateCollectionError,
  NotLikedCollectionError,
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
      const { user } = c.get("session")!;
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
      const session = c.get("session");
      const collectionService = c.get("collectionService");

      const collectionResult = await collectionService.getCollection({
        id: new Id(id),
        by: session?.user?.id,
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
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.removeCollection({
        id: new Id(id),
        by: session.user.id,
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

      return c.json({}, 200);
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
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.editCollection({
        id: new Id(id),
        by: session.user.id,
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
      const session = c.get("session");

      const { collectionId } = c.req.valid("param");
      const { limit, cursor, search } = c.req.valid("query");

      const reviewService = c.get("reviewService");

      const result = await reviewService.getCollectionReviews({
        collectionId: new Id(collectionId),
        limit,
        cursor,
        by: session?.user?.id,
        search,
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
  )
  .post(
    "/collections/:collectionId/reviews",
    authMiddleware,
    validator(
      "json",
      z.object({
        score: z.number().int().min(1).max(10).nullish(),
        description: z.string().min(1).max(400).nullish(),
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
      const session = c.get("session")!;

      const reviewService = c.get("reviewService");

      const result = await reviewService.createReview({
        collectionId: new Id(collectionId),
        by: session.user.id,
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
  )
  .put(
    "/collections/:collectionId/likes",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.likeCollection({
        collectionId: new Id(collectionId),
        userId: session.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof AlreadyLikedCollectionError) {
          return c.json({ error: "ALREADY_LIKED" as const }, 409);
        }

        throw error;
      }

      return c.json({ ok: true });
    }
  )
  .delete(
    "/collections/:collectionId/likes",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.unlikeCollection({
        collectionId: new Id(collectionId),
        userId: session.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof NotLikedCollectionError) {
          return c.json({ error: "NOT_LIKED" as const }, 409);
        }

        throw error;
      }

      return c.json({ ok: true });
    }
  )
  .get(
    "/collections/:id/socials",
    validator("param", z.object({ id: z.coerce.number().int().positive() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const session = c.get("session");
      const collectionService = c.get("collectionService");

      const socialsResult = await collectionService.getSocials({
        collectionId: new Id(id),
        by: session?.user?.id,
      });

      if (socialsResult.isErr()) {
        const error = socialsResult.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const socials = socialsResult.unwrap();

      return c.json(socials);
    }
  );
