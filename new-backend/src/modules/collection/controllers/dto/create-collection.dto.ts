import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createCollectionDtoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
});

export class CreateCollectionDto extends createZodDto(
  createCollectionDtoSchema,
) {}
