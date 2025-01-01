import { Hono } from "hono";

export const authRoute = new Hono()
  .post("/auth/login", (c) => {
    return c.json({ message: "Hello World" });
  })
  .post("/auth/register", (c) => {
    return c.json({ message: "Hello World" });
  })
  .post("/auth/logout", (c) => {
    return c.json({ message: "Hello World" });
  });
