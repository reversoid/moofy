import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsOptional()
  ignore?: number[];
}
