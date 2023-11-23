import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { Collection } from '../models/collection/collection';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { CommentWithInfo } from '../models/comment/comment-with-info';
import { Comment } from '../models/comment/comment';
import { User } from 'src/modules/user/models/user';
import { CommentSocialStats } from '../models/comment/comment-social-stats';
import { WrongCommentIdException } from '../exceptions/wrong-comment-id.exception';
import { CommentAlreadyLikedException } from '../exceptions/comment-already-liked.exception';
import { CommentNotLikedException } from '../exceptions/comment-not-liked.exception';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getComments(
    colelctionId: Collection['id'],
    userId: User['id'] | null,
    limit: number,
    nextKey: string | null,
  ): Promise<PaginatedData<CommentWithInfo>> {
    const paginatedComments = await this.commentRepository.getComments(
      colelctionId,
      limit,
      nextKey,
    );

    const commentsWithInfo = await this.getInfoForComments(
      paginatedComments.items,
      userId,
    );

    return { ...paginatedComments, items: commentsWithInfo };
  }

  async createComment(
    colelctionId: Collection['id'],
    userId: User['id'],
    text: string,
    replyTo?: Comment['id'],
  ): Promise<CommentWithInfo> {
    const comment = await this.commentRepository.createComment(
      userId,
      colelctionId,
      text,
      replyTo,
    );

    return this.getInfoForComment(comment, userId);
  }

  async removeComment(
    commentId: Comment['id'],
  ): Promise<{ id: Comment['id'] }> {
    await this.commentRepository.deleteComment(commentId);
    return { id: commentId };
  }

  async getCommentById(commentId: Comment['id']): Promise<Comment | null> {
    return this.commentRepository.getCommentById(commentId);
  }

  async likeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<CommentSocialStats> {
    const isLiked = await this.commentRepository.isCommentLikedByUser(
      commentId,
      userId,
    );
    if (isLiked) {
      throw new CommentAlreadyLikedException();
    }
    await this.commentRepository.likeComment(commentId, userId);
    const stats = await this.commentRepository.getCommentStats(commentId);
    if (!stats) {
      throw new WrongCommentIdException();
    }
    return stats;
  }

  async unlikeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<CommentSocialStats> {
    const isLiked = await this.commentRepository.isCommentLikedByUser(
      commentId,
      userId,
    );
    if (!isLiked) {
      throw new CommentNotLikedException();
    }
    await this.commentRepository.unlikeComment(commentId, userId);
    const stats = await this.commentRepository.getCommentStats(commentId);
    if (!stats) {
      throw new WrongCommentIdException();
    }
    return stats;
  }

  private async getInfoForComments(
    comments: Comment[],
    userId: User['id'] | null,
  ): Promise<CommentWithInfo[]> {
    return Promise.all(comments.map((c) => this.getInfoForComment(c, userId)));
  }

  private async getInfoForComment(
    comment: Comment,
    userId: User['id'] | null,
  ): Promise<CommentWithInfo> {
    const getIsLiked =
      userId === null
        ? Promise.resolve(false)
        : this.commentRepository.isCommentLikedByUser(comment.id, userId);

    const [isLiked, socialStats] = await Promise.all([
      getIsLiked,
      this.commentRepository.getCommentStats(comment.id),
    ]);

    if (!socialStats) {
      throw new WrongCommentIdException();
    }

    return { comment, socialStats, additionalInfo: { isLiked } };
  }
}
