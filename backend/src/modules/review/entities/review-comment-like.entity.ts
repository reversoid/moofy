import { User } from 'src/modules/user/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewComment } from './review-comment.entity';

@Entity()
export class ReviewCommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ReviewComment, (comment) => comment.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  comment: ReviewComment;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Index()
  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;
}
