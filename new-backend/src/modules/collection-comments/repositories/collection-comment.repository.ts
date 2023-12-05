import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { User, selectUser } from 'src/modules/user/models/user';
import {
  Collection,
  selectCollection,
} from '../../collection/models/collection';
import {
  Comment,
  commentSchema,
  selectComment,
} from 'src/modules/collection-comments/models/comment';
import { CommentSocialStats } from 'src/modules/collection-comments/models/comment-social-stats';
import { CommentLike } from '../models/comment-like';

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
        created_at: parsedKey ? { lte: new Date(parsedKey) } : undefined,
        deleted_at: { not: null },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit + 1,
    });
    return super.getPaginatedData(comments, limit, 'created_at');
  }

  async isCommentLikedByUser(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<boolean> {
    const comment = await this.prismaService.comment_like.findFirst({
      where: {
        user: { id: userId },
        commentId,
        deleted_at: { not: null },
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
            comment_like: { where: { deleted_at: { not: null } } },
            other_comment: { where: { deleted_at: { not: null } } },
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
      likesAmount: data._count.comment_like,
      repliesAmount: data._count.other_comment,
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
      where: { id: commentId, deleted_at: { not: null } },
    });
    return comment;
  }

  async deleteComment(
    commentId: Comment['id'],
  ): Promise<{ id: Comment['id'] }> {
    await this.prismaService.comment.update({
      data: { deleted_at: new Date() },
      where: { id: commentId },
    });

    return { id: commentId };
  }

  async likeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<void> {
    await this.prismaService.comment_like.create({
      data: { commentId, userId },
    });
  }

  async unlikeComment(
    commentId: Comment['id'],
    userId: User['id'],
  ): Promise<void> {
    await this.prismaService.comment_like.updateMany({
      data: { deleted_at: new Date() },
      where: { commentId, userId },
    });
  }

  async getCommentLike(likeId: number): Promise<CommentLike | null> {
    const commentLike = await this.prismaService.comment_like.findUnique({
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
