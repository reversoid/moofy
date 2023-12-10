import { filmSchema, selectFilm } from 'src/modules/film/models/film';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.number().int(),
  score: z.number().int().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  film: filmSchema,
});

export type Review = z.infer<typeof reviewSchema>;

export const selectReview: PrismaSelectEntity<Review> = {
  createdAt: true,
  description: true,
  film: {
    select: selectFilm,
  },
  id: true,
  score: true,
  updatedAt: true,
};
