import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import { z } from "zod";

export const profileRoute = new Hono()
  .use(authMiddleware)
  .get("/profile", async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new Error("UNAUTHORIZED");
    }

    return c.json({ user });
  })
  .get(
    "/profile/collections",
    validator(
      "query",
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { limit, cursor } = c.req.valid("query");
      const collectionService = c.get("collectionService");

      if (!user) {
        throw new Error("UNAUTHORIZED");
      }

      const result = await collectionService.getUserCollections(
        user.id,
        limit,
        cursor
      );

      if (!result.isOk()) {
        throw new Error("USER_NOT_FOUND");
      }

      return c.json({ collections: result.unwrap() });
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

      return c.json({ user: updatedUser });
    }
  );
