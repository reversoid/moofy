import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { z } from "zod";
import {
  CollectionNotFoundError,
  FilmNotFoundError,
  ReviewOnFilmExistsError,
  ReviewNotFoundError,
  NotOwnerOfReviewError,
} from "@repo/core/services";
import { validator } from "../utils/validator";
import { Id } from "@repo/core/utils";
import { makeDto } from "../utils/make-dto";

export const reviewRoute = new Hono()
  .get(
    "/reviews/:reviewId",
    validator(
      "param",
      z.object({
        reviewId: z.coerce.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const reviewService = c.get("reviewService");

      const review = await reviewService.getReview(new Id(reviewId));

      if (!review) {
        return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
      }

      return c.json(makeDto({ review }));
    }
  )
  .delete(
    "/reviews/:reviewId",
    authMiddleware,
    validator(
      "param",
      z.object({
        reviewId: z.coerce.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const reviewService = c.get("reviewService");
      const user = c.get("user");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await reviewService.removeReview(
        new Id(reviewId),
        user.id
      );

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }

        if (error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" }, 403);
        }
      }

      return new Response(null, { status: 204 });
    }
  )
  .patch(
    "/reviews/:reviewId",
    authMiddleware,
    validator(
      "param",
      z.object({
        reviewId: z.coerce.number().int().positive(),
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
      const user = c.get("user");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await reviewService.editReview(
        new Id(reviewId),
        {
          score,
          description,
        },
        user.id
      );

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" }, 404);
        }

        if (error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" }, 403);
        }
      }

      const updatedReview = result.unwrap();
      return c.json(makeDto({ review: updatedReview }));
    }
  );
