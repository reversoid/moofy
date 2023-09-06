import ApiService from '@/shared/api/api.service';
import { Comment } from '@/shared/api/types/comment.type';

export interface BasicCommentDto {
  listId: number;
  commentId: number;
}

export interface CreateCommentDto {
  text: string;
  listId: number;
}

export interface ReplyToCommentDto extends BasicCommentDto {
  text: string;
}

export class CommentService extends ApiService {
  likeComment({ commentId, listId }: BasicCommentDto) {
    return this.put<void>(`/list/${listId}/comments/${commentId}/likes`, {
      useJWT: true,
    });
  }

  unlikeComment({ commentId, listId }: BasicCommentDto) {
    return this.delete<void>(`/list/${listId}/comments/${commentId}/likes`, {
      useJWT: true,
    });
  }

  createComment({ listId, text }: CreateCommentDto) {
    return this.post<Comment>(`/list/${listId}/comments`, {
      useJWT: true,
      json: {
        text,
      },
    });
  }

  replyToComment({ commentId, listId, text }: ReplyToCommentDto) {
    return this.post<Comment>(`/list/${listId}/comments`, {
      useJWT: true,
      json: {
        text,
        replyToId: commentId,
      },
    });
  }
}

export const commentService = new CommentService();
