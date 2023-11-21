import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCollectionDtoSchema = z.object({
  name: z.string().optional(),
  description: z.string().nullish(),
  imageUrl: z.string().url().nullable(),
});

export class UpdateCollectionDto extends createZodDto(
  createCollectionDtoSchema,
) {}
