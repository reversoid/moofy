import { Hono } from "hono";

import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import { z } from "zod";
import { NotifyUpdateType } from "@repo/core/entities";
import { makePreferencesDto } from "../utils/make-dto";

export const preferencesRoute = new Hono()
  .get("/", authMiddleware, async (c) => {
    const session = c.get("session")!;
    const preferencesService = c.get("preferencesService");

    const preferencesResult = await preferencesService.getUserPreferences(
      session.user.id
    );

    const preferences = preferencesResult.unwrap();

    return c.json({ preferences: makePreferencesDto(preferences) }, 200);
  })
  .patch(
    "/",
    validator(
      "json",
      z.object({
        notifyUpdateType: z.array(z.enum(["feature", "improvement", "bugfix"])),
      })
    ),
    authMiddleware,
    async (c) => {
      const session = c.get("session")!;
      const { notifyUpdateType } = c.req.valid("json");

      const preferencesService = c.get("preferencesService");

      const preferencesResult = await preferencesService.updateUserPreferences(
        session.user.id,
        {
          notifyUpdateType: notifyUpdateType.map((t) => NotifyUpdateType[t]),
        }
      );

      const preferences = preferencesResult.unwrap();

      return c.json({ preferences: makePreferencesDto(preferences) }, 200);
    }
  );
