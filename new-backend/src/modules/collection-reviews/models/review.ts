import { filmSchema } from 'src/modules/film/models/film';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.number().int(),
  score: z.number().int().nullable(),
  description: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  film: filmSchema,
});

export type Review = z.infer<typeof reviewSchema>;

export const selectReview: PrismaSelectEntity<Review> = {
  created_at: true,
  description: true,
  film: {
    select: {
      id: true,
      name: true,
      posterPreviewUrl: true,
      posterUrl: true,
      year: true,
    },
  },
  id: true,
  score: true,
  updated_at: true,
};
