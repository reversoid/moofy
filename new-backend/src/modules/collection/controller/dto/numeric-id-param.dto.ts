import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const numericIdParamDtoSchema = z.object({
  id: z.coerce.number().int(),
});

export class NumericIdParamDto extends createZodDto(numericIdParamDtoSchema) {}
