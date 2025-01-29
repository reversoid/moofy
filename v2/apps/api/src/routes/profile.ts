import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import { z } from "zod";
import { UserNotFoundError } from "@repo/core/services";
import { makeDto } from "../utils/make-dto";

export const profileRoute = new Hono()
  .use(authMiddleware)
  .get("/profile", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new Error("UNAUTHORIZED");
    }

    return c.json(makeDto({ user }));
  })
  .get(
    "/profile/collections",
    validator(
      "query",
      z.object({
        search: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { limit, cursor, search } = c.req.valid("query");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await collectionService.getUserCollections(
        user.id,
        limit,
        cursor,
        search,
        true
      );

      if (!result.isOk()) {
        if (result.error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" }, 404);
        }
      }

      return c.json(makeDto({ collections: result.unwrap() }));
    }
  )
  .patch(
    "/profile",
    validator(
      "json",
      z.object({
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { description, imageUrl } = c.req.valid("json");
      const userService = c.get("userService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const updatedUser = await userService.updateUser(user.id, {
        description,
        imageUrl,
      });

      return c.json(makeDto({ user: updatedUser }));
    }
  );
