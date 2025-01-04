import { Hono } from "hono";
import { authMiddleware } from "../utils/auth-middleware";
import { validator } from "../utils/validator";
import z from "zod";
import { UnofficialKpProvider } from "@repo/film-providers";

const filmProvider = new UnofficialKpProvider();

export const searchRoute = new Hono().use(authMiddleware).get(
  "/search/films",
  validator(
    "query",
    z.object({
      search: z.string().default(""),
    })
  ),
  async (c) => {
    const { search } = c.req.valid("query");
    const films = await filmProvider.searchFilmsByName(search);
    return c.json({ films });
  }
);
