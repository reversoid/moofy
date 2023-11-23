import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createReviewSchemaDto = z.object({
  description: z.string().nullish(),
  score: z.number().int().min(1).max(10).nullish(),
  filmId: z.string(),
});

export class CreateReviewDto extends createZodDto(createReviewSchemaDto) {}
