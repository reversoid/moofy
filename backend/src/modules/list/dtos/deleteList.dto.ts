import { IsInt } from 'class-validator';

export class DeleteListDTO {
  @IsInt()
  listId: number;
}
