import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import { z } from "zod";
import { Id } from "@repo/core/utils";
import {
  CollectionNotFoundError,
  NotOwnerOfReviewError,
  UserNotFoundError,
} from "@repo/core/services";
import { makeDto } from "../utils/make-dto";

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
  );
