import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import {
  BrokenImageError,
  ImageTooLargeError,
  WrongFileTypeError,
} from "@repo/core/services";

export const uploadRoute = new Hono().post(
  "/upload/image/:resource",
  validator("param", z.object({ resource: z.enum(["collection", "user"]) })),
  validator("form", z.object({ image: z.instanceof(File) })),
  async (c) => {
    const { resource } = c.req.valid("param");
    const body = await c.req.parseBody();
    const imageService = c.get("imageService");

    const image = body["image"] as File;

    const result = await imageService.uploadImage(image, resource);

    if (result.isErr()) {
      const error = result.error;
      if (error instanceof ImageTooLargeError) {
        return c.json({ error: "IMAGE_TOO_LARGE" }, 400);
      }

      if (error instanceof WrongFileTypeError) {
        return c.json({ error: "WRONG_FILE_TYPE" }, 400);
      }

      if (error instanceof BrokenImageError) {
        return c.json({ error: "BROKEN_IMAGE" }, 400);
      }
    }

    const { url } = result.unwrap();

    return c.json({ imageUrl: url });
  }
);
