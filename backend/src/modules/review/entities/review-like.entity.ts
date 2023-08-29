import { User } from 'src/modules/user/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class ReviewLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Review, (review) => review.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  review: Review;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Index()
  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;
}
