import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetRecommendedUsersDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit = 10;
}
