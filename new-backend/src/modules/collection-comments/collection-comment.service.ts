import { Injectable, NotFoundException } from '@nestjs/common';
import { CollectionCommentRepository } from './collection-comment.repository';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { User } from 'src/modules/user/models/user';
import { WrongCommentIdException } from './exceptions/wrong-comment-id.exception';
import { CommentNotLikedException } from './exceptions/comment-not-liked.exception';
import { Collection } from '../collection/models/collection';
import { CommentAlreadyLikedException } from './exceptions/comment-already-liked.exception';
import { CommentSocialStats } from './models/comment-social-stats';
import { CommentWithInfo } from './models/comment-with-info';
import { Comment } from './models/comment';
import { CommentLike } from './models/comment-like';
import { EventsService } from '../events/events.service';

@Injectable()
export class CollectionCommentService {
  constructor(
    private readonly commentRepository: CollectionCommentRepository,
    private readonly eventService: EventsService,
  ) {}

  async getComments(
    colelctionId: Collection['id'],
    userId: User['id'] | null,
    limit: number,
    nextKey?: string,
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

    this.eventService.createUserEvent({
      type: 'COMMENT_CREATED',
      targetId: comment.id,
    });

    return this.getInfoForComment(comment, userId);
  }

  async removeComment(commentId: Comment['id']): Promise<void> {
    const comment = await this.commentRepository.deleteComment(commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    this.eventService.cancelUserEvent({
      type: 'COMMENT_CREATED',
      targetId: comment.id,
    });
  }

  async getCommentById(commentId: Comment['id']): Promise<Comment | null> {
    return this.commentRepository.getCommentById(commentId);
  }

  async getCollectionByCommentId(
    commentId: Comment['id'],
  ): Promise<Collection | null> {
    return this.commentRepository.getCollectionByCommentId(commentId);
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
    const like = await this.commentRepository.likeComment(commentId, userId);
    const stats = await this.commentRepository.getCommentStats(commentId);
    if (!stats) {
      throw new WrongCommentIdException();
    }

    this.eventService.createUserEvent({
      targetId: like.id,
      type: 'LIST_LIKED',
    });

    return stats;
  }

  async unlikeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<CommentSocialStats> {
    const like = await this.commentRepository.unlikeComment(commentId, userId);
    if (!like) {
      throw new CommentNotLikedException();
    }

    const stats = await this.commentRepository.getCommentStats(commentId);
    if (!stats) {
      throw new WrongCommentIdException();
    }

    this.eventService.cancelUserEvent({
      targetId: like.id,
      type: 'LIST_LIKED',
    });

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

  async getCommentLike(likeId: CommentLike['id']): Promise<CommentLike | null> {
    return this.commentRepository.getCommentLike(likeId);
  }
}
