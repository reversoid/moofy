import { IsInt } from 'class-validator';

export class AddFavoriteListDTO {
  @IsInt()
  listId: number;
}
