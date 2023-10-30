import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export enum GetRandomReviewType {
  ALL = 'ALL',
  RANKED = 'RANKED',
  UNRANKED = 'UNRANKED',
}

export class GetRandomReviewDTO {
  @IsInt()
  @Type(() => Number)
  listId: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit = 1;

  @IsEnum(GetRandomReviewType)
  @IsOptional()
  type: GetRandomReviewType = GetRandomReviewType.ALL;
}
