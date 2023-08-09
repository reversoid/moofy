import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';

export interface CommentWithRepliesAmount {
  comment: Comment;
  repliesAmount: number;
}

@Injectable()
export class CommentRepository extends PaginatedRepository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getComments(
    listId: number,
    commentId?: number,
    limit = 20,
    lowerBound?: Date,
  ): Promise<CommentWithRepliesAmount[]> {
    const query = this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.list', 'list')
      .leftJoin('comment.replies', 'replies')
      .addSelect('COUNT(replies.id)', 'repliesCount')
      .andWhere('comment.list = :listId', { listId })
      .groupBy('comment.id')
      .addGroupBy('user.id')
      .addGroupBy('list.id')
      .orderBy('comment.created_at', 'DESC')
      .take(limit + 1);

    if (commentId !== undefined) {
      query.andWhere('comment.reply_to = :commentId', { commentId });
    }

    if (lowerBound !== undefined) {
      query.andWhere('comment.created_at >= :lowerBound', { lowerBound });
    }

    if (commentId === undefined) {
      query.andWhere('comment.reply_to IS NULL', { listId });
    }

    const comments = await query.getRawAndEntities();

    const result = comments.entities.map<CommentWithRepliesAmount>(
      (comment, index) => ({
        comment,
        repliesAmount: comments.raw[index].repliesCount,
      }),
    );

    return result;
  }
}
