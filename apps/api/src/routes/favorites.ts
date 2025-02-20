import {
  CollectionAlreadyFavoritedError,
  CollectionNotFavoritedError,
  CollectionNotFoundError,
  NoAccessToPrivateCollectionError,
} from "@repo/core/services";
import { Id } from "@repo/core/utils";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import { makeDto } from "../utils/make-dto";
import { validator } from "../utils/validator";

export const favoritesRoute = new Hono()
  .use(authMiddleware)
  .get(
    "/favorites",
    validator(
      "query",
      z.object({
        search: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const { limit, cursor, search } = c.req.valid("query");
      const user = c.get("user")!;
      const favoriteCollectionService = c.get("favoriteCollectionService");

      const result = await favoriteCollectionService.getUserFavoriteCollections(
        {
          userId: user.id,
          limit,
          cursor,
          search,
        }
      );

      return c.json(makeDto({ collections: result.unwrap() }));
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
      const user = c.get("user")!;
      const favoriteCollectionService = c.get("favoriteCollectionService");

      const result = await favoriteCollectionService.addToFavorites({
        userId: user.id,
        collectionId: new Id(collectionId),
      });

      if (!result.isOk()) {
        const error = result.unwrapErr();

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof CollectionAlreadyFavoritedError) {
          return c.json(
            { error: "COLLECTION_ALREADY_FAVORITED" as const },
            409
          );
        }

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.json(makeDto({ collection: result.unwrap() }));
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
      const user = c.get("user")!;
      const favoriteCollectionService = c.get("favoriteCollectionService");

      const result = await favoriteCollectionService.removeFromFavorites({
        userId: user.id,
        collectionId: new Id(collectionId),
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof CollectionNotFavoritedError) {
          return c.json({ error: "COLLECTION_NOT_FAVORITED" as const }, 400);
        }

        throw error;
      }

      return c.json(makeDto({ collection: result.unwrap() }));
    }
  );
