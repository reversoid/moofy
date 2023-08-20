import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../../entities/review.entity';
import { Film } from 'src/modules/film/entities/film.entity';
import { List } from 'src/modules/list/entities/list.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class ReviewDTO implements Review {
  @ApiProperty()
  film: Film;
  user: User;
  score: number;
  list: List;
  description: string;
  tags?: string[];
  created_at: Date;
  @ApiProperty()
  id: number;
  @ApiProperty({ type: String })
  updated_at: Date;
  @ApiProperty()
  order_in_list: number;
}
