import { IsInt } from 'class-validator';

export class DeleteFavoriteListDTO {
  @IsInt()
  listId: number;
}
