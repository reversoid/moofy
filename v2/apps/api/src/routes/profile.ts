import { UsernameExistsError } from "@repo/core/services";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import { makeDto } from "../utils/make-dto";
import { validator } from "../utils/validator";

export const profileRoute = new Hono()
  .use(authMiddleware)
  .get("/profile", async (c) => {
    const user = c.get("user")!;
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
      const user = c.get("user")!;
      const { limit, cursor, search } = c.req.valid("query");
      const collectionService = c.get("collectionService");

      const result = await collectionService.getUserCollections({
        userId: user.id,
        limit,
        cursor,
        search,
        by: user.id,
      });

      return c.json(makeDto({ collections: result.unwrap() }));
    }
  )
  .patch(
    "/profile",
    validator(
      "json",
      z.object({
        username: z.string().optional(),
        password: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      })
    ),
    async (c) => {
      const user = c.get("user")!;
      const { description, imageUrl, password, username } = c.req.valid("json");
      const userService = c.get("userService");

      const updatedUserResult = await userService.updateUser({
        id: user.id,
        data: {
          description,
          imageUrl,
          username,
          password,
        },
      });

      if (updatedUserResult.isErr()) {
        const error = updatedUserResult.unwrapErr();
        if (error instanceof UsernameExistsError) {
          return c.json({ error: "USERNAME_ALREADY_EXISTS" }, 409);
        }

        throw error;
      }

      return c.json(makeDto({ user: updatedUserResult.unwrap() }));
    }
  );
