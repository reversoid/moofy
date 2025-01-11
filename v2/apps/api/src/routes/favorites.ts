import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import { z } from "zod";
import { Id } from "@repo/core/utils";
import {
  CollectionAlreadyFavoritedError,
  CollectionIsPrivateError,
  CollectionNotFavoritedError,
  CollectionNotFoundError,
  UserNotFoundError,
} from "@repo/core/services";

export const favoritesRoute = new Hono()
  .use(authMiddleware)
  .get(
    "/favorites",
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const { limit, cursor } = c.req.valid("query");
      const user = c.get("user");
      const favoriteCollectionService = c.get("favoriteCollectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await favoriteCollectionService.getUserFavoriteCollections(
        user.id,
        limit,
        cursor
      );

      if (!result.isOk()) {
        if (result.error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" }, 404);
        }
      }

      return c.json({ collections: result.unwrap() });
    }
  )
  .get(
    "/favorites/:collectionId",
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const user = c.get("user");
      const favoriteCollectionService = c.get("favoriteCollectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const isFavorited = await favoriteCollectionService.isCollectionFavorited(
        user.id,
        new Id(collectionId)
      );

      return c.json({ isFavorited });
    }
  )
  .put(
    "/favorites/:collectionId",
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const user = c.get("user");
      const favoriteCollectionService = c.get("favoriteCollectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await favoriteCollectionService.addToFavorites(
        user.id,
        new Id(collectionId)
      );

      if (!result.isOk()) {
        const error = result.unwrapErr();

        if (
          error instanceof CollectionNotFoundError ||
          error instanceof CollectionIsPrivateError
        ) {
          return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
        }

        if (error instanceof CollectionAlreadyFavoritedError) {
          return c.json({ error: "COLLECTION_ALREADY_FAVORITED" }, 400);
        }
      }

      return c.json({ collection: result.unwrap() });
    }
  )
  .delete(
    "/favorites/:collectionId",
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const user = c.get("user");
      const favoriteCollectionService = c.get("favoriteCollectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await favoriteCollectionService.removeFromFavorites(
        user.id,
        new Id(collectionId)
      );

      if (!result.isOk()) {
        const error = result.unwrapErr();
        if (
          error instanceof CollectionNotFoundError ||
          error instanceof CollectionIsPrivateError
        ) {
          return c.json({ error: "COLLECTION_NOT_FOUND" }, 404);
        }

        if (error instanceof CollectionNotFavoritedError) {
          return c.json({ error: "COLLECTION_NOT_FAVORITED" }, 400);
        }
      }

      return c.json({ collection: result.unwrap() });
    }
  );
