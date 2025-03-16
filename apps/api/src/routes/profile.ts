import { UsernameExistsError, WrongPasswordError } from "@repo/core/services";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import {
  makeCollectionDto,
  makeUserDto,
  withPaginatedData,
} from "../utils/make-dto";

export const profileRoute = new Hono()
  .use(authMiddleware)
  .get("", async (c) => {
    const session = c.get("session")!;
    return c.json({ user: makeUserDto(session.user) });
  })
  .get(
    "/collections",
    validator(
      "query",
      z.object({
        search: z.string().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    ),
    async (c) => {
      const session = c.get("session")!;
      const { limit, cursor, search } = c.req.valid("query");
      const collectionService = c.get("collectionService");

      const result = await collectionService.getUserCollections({
        userId: session.user.id,
        limit,
        cursor,
        search,
        by: session.user.id,
      });

      return c.json({
        collections: withPaginatedData(makeCollectionDto)(result.unwrap()),
      });
    }
  )
  .patch(
    "",
    validator(
      "json",
      z.object({
        username: z.string().optional(),
        description: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        password: z
          .object({
            old: z.string(),
            new: z.string(),
          })
          .optional(),
      })
    ),
    async (c) => {
      const session = c.get("session")!;
      const { description, imageUrl, password, username } = c.req.valid("json");
      const userService = c.get("userService");

      const updatedUserResult = await userService.updateUser({
        id: session.user.id,
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
          return c.json({ error: "USERNAME_EXISTS" as const }, 409);
        }

        if (error instanceof WrongPasswordError) {
          return c.json({ error: "OLD_PASSWORD_INCORRECT" as const }, 401);
        }

        throw error;
      }

      return c.json({ user: makeUserDto(updatedUserResult.unwrap()) });
    }
  );
