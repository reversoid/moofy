import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

export interface CommentWithInfo {
  comment: Comment;
  info: {
    likesAmount: number;
    repliesAmount: number;
    isLiked: boolean;
  };
}

@Injectable()
export class CommentRepository extends PaginatedRepository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async getComments(
    listId: number,
    currentUserId?: number,
    commentId?: number,
    limit = 20,
    lowerBound?: Date,
  ): Promise<IterableResponse<CommentWithInfo>> {
    const query = this.createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .leftJoin('comment.list', 'list')
      .addSelect('list.id')
      .addSelect(['user.id', 'user.username', 'user.image_url'])
      .leftJoin('comment.replies', 'replies')
      .addSelect('COUNT(replies.id)', 'repliesCount')

      .leftJoin('comment.likes', 'likes')
      .addSelect('COUNT(likes.id)', 'likesCount')

      .leftJoin(
        'comment.likes',
        'currentUserLike',
        'currentUserLike.userId = :currentUserId',
        { currentUserId },
      )
      .addSelect('currentUserLike.id', 'currentUserLikeId')

      .andWhere('comment.list = :listId', { listId })
      .groupBy('comment.id')
      .addGroupBy('user.id')
      .addGroupBy('list.id')
      .addGroupBy('currentUserLike.id')

      .orderBy('comment.created_at', 'DESC')
      .take(limit + 1);

    if (commentId !== undefined) {
      query.andWhere('comment.reply_to = :commentId', { commentId });
    }

    if (lowerBound !== undefined) {
      const { date, operator } = super.getRAWDatesCompareString(lowerBound);
      query.andWhere(`comment.created_at ${operator} :lowerBound`, {
        lowerBound: date,
      });
    }

    if (commentId === undefined) {
      query.andWhere('comment.reply_to IS NULL', { listId });
    }

    const comments = await query.getRawAndEntities();

    const result = comments.entities.map<CommentWithInfo>((comment, index) => ({
      comment,
      info: {
        repliesAmount: Number(comments.raw[index].repliesCount ?? 0),
        likesAmount: Number(comments.raw[index].likesCount ?? 0),
        isLiked: Boolean(comments.raw[index].currentUserLikeId),
      },
    }));

    return super.processPagination<CommentWithInfo>(
      result,
      limit,
      'created_at',
    );
  }
}
