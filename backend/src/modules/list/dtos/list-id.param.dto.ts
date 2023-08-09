import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ListIdParamsDTO {
  @IsInt()
  @Type(() => Number)
  id: number;
}
