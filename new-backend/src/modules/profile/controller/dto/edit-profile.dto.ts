import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// TODO check for username pattern
const editProfileDtoSchema = z.object({
  username: z.string().optional(),
  description: z.string().nullish(),
  imageUrl: z.string().url().nullish(),
});

export class EditProfileDto extends createZodDto(editProfileDtoSchema) {}
