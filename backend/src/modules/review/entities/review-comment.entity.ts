import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewCommentLike } from './review-comment-like.entity';
import { Review } from './review.entity';

@Entity()
export class ReviewComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => ReviewComment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  reply_to: ReviewComment;

  @OneToMany(() => ReviewComment, (comment) => comment.reply_to)
  replies: ReviewComment[];

  @OneToMany(() => ReviewCommentLike, (like) => like.comment)
  likes: ReviewCommentLike[];

  @ManyToOne(() => Review, (review) => review.comments)
  review: Review;

  @Index()
  @Column('varchar', { length: 400, nullable: false })
  text: string;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Index()
  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;
}
