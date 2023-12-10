import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { User, selectUser } from 'src/modules/user/models/user';
import { Collection, selectCollection } from '../collection/models/collection';
import {
  Comment,
  commentSchema,
  selectComment,
} from 'src/modules/collection-comments/models/comment';
import { CommentSocialStats } from 'src/modules/collection-comments/models/comment-social-stats';
import { CommentLike } from './models/comment-like';

@Injectable()
export class CollectionCommentRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async getComments(
    collectionId: Collection['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Comment>> {
    const parsedKey = super.parseNextKey(nextKey);

    const comments = await this.prismaService.comment.findMany({
      select: selectComment,
      where: {
        listId: collectionId,
        createdAt: parsedKey ? { lte: new Date(parsedKey) } : undefined,
        deletedAt: { not: null },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1,
    });
    return super.getPaginatedData(comments, limit, 'createdAt');
  }

  async isCommentLikedByUser(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<boolean> {
    const comment = await this.prismaService.commentLike.findFirst({
      where: {
        user: { id: userId },
        commentId,
        deletedAt: { not: null },
      },
    });
    return Boolean(comment);
  }

  async getCommentStats(
    commentId: Comment['id'],
  ): Promise<CommentSocialStats | null> {
    const data = await this.prismaService.comment.findUnique({
      select: {
        _count: {
          select: {
            commentLike: { where: { deletedAt: { not: null } } },
            otherComment: { where: { deletedAt: { not: null } } },
          },
        },
      },
      where: {
        id: commentId,
      },
    });

    if (!data) {
      return null;
    }

    return {
      likesAmount: data._count.commentLike,
      repliesAmount: data._count.otherComment,
    };
  }

  async createComment(
    userId: User['id'],
    collectionId: Collection['id'],
    text: string,
    replyTo?: Comment['id'],
  ): Promise<Comment> {
    const comment = await this.prismaService.comment.create({
      data: { text, userId, listId: collectionId, replyToId: replyTo },
      select: selectComment,
    });
    return comment;
  }
  async getCommentById(commentId: Comment['id']): Promise<Comment | null> {
    const comment = await this.prismaService.comment.findUnique({
      select: selectComment,
      where: { id: commentId, deletedAt: { not: null } },
    });
    return comment;
  }

  async deleteComment(commentId: Comment['id']): Promise<{
    id: Comment['id'];
    replyTo?: Comment['replyToId'] | null;
  } | null> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
      select: { replyToId: true, id: true },
    });
    if (!comment) {
      return null;
    }

    await this.prismaService.comment.update({
      data: { deletedAt: new Date() },
      where: { id: commentId },
    });

    return { id: comment.id, replyTo: comment.replyToId };
  }

  async likeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<{ id: Comment['id'] }> {
    return this.prismaService.commentLike.create({
      data: { commentId, userId },
    });
  }

  async unlikeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<{ id: Comment['id'] } | null> {
    const like = await this.prismaService.commentLike.findFirst({
      where: {
        commentId,
        userId,
      },
    });
    if (!like) {
      return null;
    }

    await this.prismaService.commentLike.update({
      data: { deletedAt: new Date() },
      where: { id: like.id },
    });

    return { id: like.id };
  }

  async getCommentLike(likeId: number): Promise<CommentLike | null> {
    const commentLike = await this.prismaService.commentLike.findUnique({
      where: { id: likeId },
      select: {
        id: true,
        comment: {
          select: {
            ...selectComment,
            list: {
              select: selectCollection,
            },
          },
        },
        user: {
          select: selectUser,
        },
      },
    });

    if (!commentLike) {
      return null;
    }

    return {
      collection: commentLike.comment.list!,
      comment: commentSchema.parse(commentLike.comment),
      user: commentLike.user,
      id: commentLike.id,
    } satisfies CommentLike;
  }

  async getCollectionByCommentId(
    commentId: Comment['id'],
  ): Promise<Collection | null> {
    return this.prismaService.list.findFirst({
      where: {
        comment: { some: { id: commentId } },
      },
      select: selectCollection,
    });
  }
}
