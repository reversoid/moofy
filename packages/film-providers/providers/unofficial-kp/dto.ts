import z from "zod";

const filmType = z.enum([
  "FILM",
  "TV_SERIES",
  "TV_SHOW",
  "MINI_SERIES",
  "VIDEO",
]);

export const searchFilmDtoSchema = z
  .object({
    filmId: z.number(),
    nameRu: z.string().optional(),
    nameEn: z.string().optional(),
    year: z.coerce.number(),
    posterUrl: z.string().url(),
    posterUrlPreview: z.string().url(),
    filmLength: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .transform((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      })
      .optional(),
    genres: z.array(
      z.object({
        genre: z.string(),
      })
    ),
    type: filmType,
  })
  .refine((obj) => obj.nameEn || obj.nameRu);

export const getFilmDtoSchema = z
  .object({
    kinopoiskId: z.number(),
    nameRu: z.string().optional(),
    nameEn: z.string().nullable(),
    year: z.coerce.number(),
    posterUrl: z.string().url(),
    posterUrlPreview: z.string().url(),
    filmLength: z.number().nullable(),
    genres: z.array(
      z.object({
        genre: z.string(),
      })
    ),
    type: filmType,
  })
  .refine((obj) => obj.nameEn || obj.nameRu);

export const filmsSearchResponseSchema = z.object({
  films: z.array(z.unknown()),
});
