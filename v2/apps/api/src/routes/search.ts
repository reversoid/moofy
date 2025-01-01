import { Hono } from "hono";

export const searchRoute = new Hono().get("/search/films", (c) => {
  return c.json({ message: "Hello World" });
});
