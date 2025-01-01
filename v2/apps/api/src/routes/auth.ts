import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";

export const authRoute = new Hono()
  .post(
    "/auth/login",
    validator(
      "json",
      z.object({
        username: z.string(),
        password: z.string(),
      })
    ),
    (c) => {
      return c.json({ message: "Hello World" });
    }
  )
  .post(
    "/auth/register",
    validator(
      "json",
      z.object({
        username: z.string(),
        password: z.string().min(8),
      })
    ),
    (c) => {
      return c.json({ message: "Hello World" });
    }
  )
  .post("/auth/logout", (c) => {
    return c.json({ message: "Hello World" });
  });
