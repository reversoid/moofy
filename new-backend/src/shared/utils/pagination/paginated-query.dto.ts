import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const paginatedQueryDtoSchema = z.object({
  limit: z.coerce.number().int().optional(),
  nextKey: z.string().optional(),
});

export class PaginatedQueryDto extends createZodDto(paginatedQueryDtoSchema) {}
