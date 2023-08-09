import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

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
  ): Promise<IterableResponse<CommentWithRepliesAmount>> {
    const query = this.createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.list', 'list')
      .addSelect('list.id')
      .addSelect(['user.id', 'user.username', 'user.image_url'])
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

    return super.processPagination<CommentWithRepliesAmount>(
      result,
      limit,
      'created_at',
    );
  }
}
