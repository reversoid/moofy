import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity()
export class ToWatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('boolean', { nullable: false, default: false })
  watched: boolean;

  @Index()
  @ManyToOne(() => User, (user) => user.toWatch, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Index()
  @ManyToOne(() => Film, (film) => film.toWatch, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  film: Film[];
}
