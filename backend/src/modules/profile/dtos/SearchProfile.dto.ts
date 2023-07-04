import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProfileDTO {
  @IsOptional()
  @IsString()
  @Type(() => String)
  username?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}
