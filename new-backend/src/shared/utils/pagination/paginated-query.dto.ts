import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const paginatedQueryDtoSchema = z.object({
  limit: z.coerce.number().int().nullish().default(null),
  nextKey: z.string().nullish().default(null),
});

export class PaginatedQueryDto extends createZodDto(paginatedQueryDtoSchema) {}
