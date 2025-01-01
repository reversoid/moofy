import { Hono } from "hono";

export const reviewRoute = new Hono()
  .get("/reviews", (c) => {
    return c.json({ message: "Hello World" });
  })
  .get("/reviews/:id", (c) => {
    return c.json({ message: "Hello World" });
  })
  .post("/reviews/:id", (c) => {
    return c.json({ message: "Hello World" });
  })
  .delete("/reviews/:id", (c) => {
    return c.json({ message: "Hello World" });
  })
  .patch("/reviews/:id", (c) => {
    return c.json({ message: "Hello World" });
  });
