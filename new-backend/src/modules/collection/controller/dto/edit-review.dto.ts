import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const editReviewSchemaDto = z.object({
  description: z.string().nullish(),
  score: z.number().int().min(1).max(10).nullish(),
});

export class EditReviewDto extends createZodDto(editReviewSchemaDto) {}
