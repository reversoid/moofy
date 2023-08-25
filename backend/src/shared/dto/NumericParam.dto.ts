import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class NumericIDParamDTO {
  @IsInt()
  @Type(() => Number)
  id: number;
}
