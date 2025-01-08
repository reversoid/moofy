import z from "zod";

const filmType = z.enum([
  "FILM",
  "TV_SERIES",
  "TV_SHOW",
  "MINI_SERIES",
  "VIDEO",
]);

export const filmDtoSchema = z.object({
  filmId: z.number().optional(),
  kinopoiskId: z.number().optional(),
  nameRu: z.string().optional(),
  nameEn: z.string(),
  year: z.coerce.number(),
  posterUrl: z.string().url(),
  posterUrlPreview: z.string().url(),
  filmLength: z.string(),
  genres: z.array(
    z.object({
      genre: z.string(),
    })
  ),
  type: filmType,
});

export const filmsSearchResponseSchema = z.object({
  films: z.array(z.unknown()),
});
