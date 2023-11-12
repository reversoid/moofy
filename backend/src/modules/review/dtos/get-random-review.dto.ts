import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(Number);
    }
    return value;
  })
  @IsNumber({}, { each: true })
  ignore?: number[];
}
