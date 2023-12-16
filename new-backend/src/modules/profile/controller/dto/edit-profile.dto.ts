import { createZodDto } from 'nestjs-zod';
import { USERNAME_PATTERN } from 'src/modules/auth/controller/dto/register.dto';
import { z } from 'zod';

const editProfileDtoSchema = z.object({
  username: z.string().regex(USERNAME_PATTERN).optional(),
  description: z.string().nullish(),
  imageUrl: z.string().url().nullish(),
});

export class EditProfileDto extends createZodDto(editProfileDtoSchema) {}
