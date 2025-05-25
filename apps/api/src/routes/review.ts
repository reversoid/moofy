import { Hono } from "hono";
import { z } from "zod";
import {
  ReviewNotFoundError,
  NotOwnerOfReviewError,
  NoAccessToPrivateCollectionError,
  TagNotFoundError,
  NotOwnerOfCollectionError,
  TagAlreadyLinkedToReviewError,
  TagNotLinkedToReviewError,
  FilmAlreadyWatched,
  FilmIsNotWatched,
} from "@repo/core/services";
import { validator } from "../utils/validator";
import { Id } from "@repo/core/utils";
import { authMiddleware } from "../utils/auth-middleware";
import { makeReviewDto } from "../utils/make-dto";
import { err } from "resulto";

export const reviewRoute = new Hono()
  .get(
    "/:reviewId",
    validator(
      "param",
      z.object({
        reviewId: z.coerce.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const reviewService = c.get("reviewService");
      const session = c.get("session");

      const reviewResult = await reviewService.getReview({
        id: new Id(reviewId),
        by: session?.user?.id,
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

      return c.json({ review: makeReviewDto(review) });
    }
  )
  .delete(
    "/:reviewId",
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
      const session = c.get("session")!;

      const result = await reviewService.removeReview({
        reviewId: new Id(reviewId),
        by: session.user.id,
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

      return c.body(null, 204);
    }
  )
  .patch(
    "/:reviewId",
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
        score: z.number().int().min(1).max(5).nullish(),
        description: z.string().min(1).max(400).nullish(),
        isHidden: z.boolean().optional(),
        updatePosition: z.boolean().optional(),
        isWatched: z.boolean().optional(),
      })
    ),
    async (c) => {
      const { reviewId } = c.req.valid("param");
      const { score, description, isHidden, updatePosition, isWatched } =
        c.req.valid("json");
      const reviewService = c.get("reviewService");
      const session = c.get("session")!;

      const result = await reviewService.editReview({
        reviewId: new Id(reviewId),
        dto: {
          score,
          description,
          isHidden,
        },
        by: session.user.id,
        updatePosition,
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

      if (isWatched) {
        const isWatchedResult = await reviewService.changeWatchedStatus({
          id: new Id(reviewId),
          by: session.user.id,
          isWatched,
        });

        if (isWatchedResult.isErr()) {
          const error = isWatchedResult.error;

          if (error instanceof FilmAlreadyWatched) {
            return c.json({ error: "ALREADY_WATCHED" as const }, 409);
          }

          if (error instanceof FilmIsNotWatched) {
            return c.json({ error: "NOT_WATCHED" as const }, 401);
          }
        }

        isWatchedResult.unwrap();
      }

      const updatedReview = result.unwrap();
      return c.json({ review: makeReviewDto(updatedReview) });
    }
  )
  .put(
    "/:reviewId/tags/:tagId",
    authMiddleware,
    validator(
      "param",
      z.object({
        reviewId: z.coerce.number().int().positive(),
        tagId: z.coerce.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId, tagId } = c.req.valid("param");
      const tagService = c.get("tagService");
      const session = c.get("session")!;

      const result = await tagService.linkTagToReview({
        reviewId: new Id(reviewId),
        tagId: new Id(tagId),
        by: session.user.id,
      });

      if (result.isErr()) {
        const error = result.error;
        if (error instanceof TagNotFoundError) {
          return c.json({ error: "TAG_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof TagAlreadyLinkedToReviewError) {
          return c.json(
            { error: "TAG_ALREADY_LINKED_TO_REVIEW" as const },
            409
          );
        }

        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.body(null, 204);
    }
  )
  .delete(
    "/:reviewId/tags/:tagId",
    authMiddleware,
    validator(
      "param",
      z.object({
        reviewId: z.coerce.number().int().positive(),
        tagId: z.coerce.number().int().positive(),
      })
    ),
    async (c) => {
      const { reviewId, tagId } = c.req.valid("param");
      const tagService = c.get("tagService");
      const session = c.get("session")!;

      const result = await tagService.unlinkTagFromReview({
        reviewId: new Id(reviewId),
        tagId: new Id(tagId),
        by: session.user.id,
      });

      if (result.isErr()) {
        const error = result.error;
        if (error instanceof TagNotFoundError) {
          return c.json({ error: "TAG_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof TagNotLinkedToReviewError) {
          return c.json({ error: "TAG_NOT_LINKED_TO_REVIEW" as const }, 400);
        }

        if (error instanceof ReviewNotFoundError) {
          return c.json({ error: "REVIEW_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.body(null, 204);
    }
  );
