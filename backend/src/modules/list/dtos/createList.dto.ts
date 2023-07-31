import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateListDTO {
  @IsString()
  @MaxLength(32)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsUrl()
  @MaxLength(120)
  imageUrl?: string;
}
