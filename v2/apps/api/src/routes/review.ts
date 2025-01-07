import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { z } from "zod";
import {
  CollectionNotFoundError,
  FilmNotFoundError,
  ReviewOnFilmExistsError,
  ReviewNotFoundError,
} from "@repo/core/services";
import { validator } from "../utils/validator";
import { Id } from "@repo/core/utils";

export const reviewRoute = new Hono()
  .use(authMiddleware)
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

        return c.json({ reviews: result.unwrap() });
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
        return c.json({ reviews });
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
      const reviewService = c.get("reviewService");

      const result = await reviewService.createReview({
        score,
        description,
        collectionId: new Id(collectionId),
        filmId: String(filmId),
      });

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
      }

      const review = result.unwrap();
      return c.json({ review }, 201);
    }
  )
  .get(
    "/reviews/:reviewId",
    validator(
      "param",
      z.object({
        reviewId: z.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const reviewService = c.get("reviewService");

      const review = await reviewService.getReview(new Id(reviewId));

      if (!review) {
        return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
      }

      return c.json({ review });
    }
  )
  .delete(
    "/reviews/:reviewId",
    validator(
      "param",
      z.object({
        reviewId: z.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const reviewService = c.get("reviewService");

      const result = await reviewService.removeReview(new Id(reviewId));

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }
      }

      return new Response(null, { status: 204 });
    }
  )
  .patch(
    "/reviews/:reviewId",
    validator(
      "param",
      z.object({
        reviewId: z.number().int().positive(),
      })
    ),
    validator(
      "json",
      z.object({
        score: z.number().int().min(1).max(10),
        description: z.string().min(1).max(1000),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const { score, description } = c.req.valid("json");
      const reviewService = c.get("reviewService");

      const result = await reviewService.editReview(new Id(reviewId), {
        score,
        description,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }
      }

      const updatedReview = result.unwrap();
      return c.json({ review: updatedReview });
    }
  );
