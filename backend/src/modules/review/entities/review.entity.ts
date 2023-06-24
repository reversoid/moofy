import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { List } from '../../list/entities/list.entity';
import { User as User } from 'src/modules/user/entities/user.entity';
import { Film } from 'src/modules/film/entities/film.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Film, (film) => film.reviews, {
    nullable: false,
  })
  film: Film;

  @ManyToOne(() => User, (user) => user.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column('smallint', { nullable: true })
  score: number;

  @ManyToOne(() => List, (list) => list.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  list: List;

  @Column('varchar', { length: 400, nullable: true })
  description: string;

  @Column('varchar', { length: 32, array: true, nullable: true })
  tags?: string[];

  @Column('numeric', { precision: 20, scale: 16, nullable: false })
  order_in_list: number;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Index()
  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;

  @Index()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  /** Is used for full text search */
  @Column({ type: 'tsvector', select: false })
  search_document: any;
}
