import { IsInt } from 'class-validator';

export class ListIdParamsDTO {
  @IsInt()
  id: number;
}
