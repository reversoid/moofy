import { Hono } from "hono";
import { z } from "zod";
import {
  ReviewNotFoundError,
  NotOwnerOfReviewError,
  NoAccessToPrivateCollectionError,
} from "@repo/core/services";
import { validator } from "../utils/validator";
import { Id } from "@repo/core/utils";
import { makeDto } from "../utils/make-dto";
import { authMiddleware } from "../utils/auth-middleware";

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
      const user = c.get("user");

      const reviewResult = await reviewService.getReview({
        id: new Id(reviewId),
        by: user?.id,
      });

      if (reviewResult.isErr()) {
        const error = reviewResult.unwrapErr();
        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const review = reviewResult.unwrap();

      if (!review) {
        return c.json({ error: "REVIEW_NOT_FOUND" as const }, 404);
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
      const user = c.get("user")!;

      const result = await reviewService.removeReview({
        reviewId: new Id(reviewId),
        by: user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }
      }

      return c.json({});
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
        score: z.number().int().min(1).max(10).nullish(),
        description: z.string().min(1).max(1000).nullish(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const { score, description } = c.req.valid("json");
      const reviewService = c.get("reviewService");
      const user = c.get("user")!;

      const result = await reviewService.editReview({
        reviewId: new Id(reviewId),
        dto: {
          score,
          description,
        },
        by: user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfReviewError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }
      }

      const updatedReview = result.unwrap();
      return c.json(makeDto({ review: updatedReview }));
    }
  );
