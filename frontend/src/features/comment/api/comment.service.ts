import ApiService from '@/shared/api/api.service';
import { Comment } from '@/shared/api/types/comment.type';

export interface LikeCommentDto {
  listId: number;
  commentId: number;
}

export interface CreateCommentDto {
  text: string;
  listId: number;
  /** If commentId is specified, will reply to comment */
  commentId?: number;
}

export class CommentService extends ApiService {
  likeComment({ commentId, listId }: LikeCommentDto) {
    return this.put<void>(`/list/${listId}/comments/${commentId}/likes`, {
      useJWT: true,
    });
  }

  unlikeComment({ commentId, listId }: LikeCommentDto) {
    return this.delete<void>(`/list/${listId}/comments/${commentId}/likes`, {
      useJWT: true,
    });
  }

  createComment({ listId, text, commentId }: CreateCommentDto) {
    return this.post<Comment>(`/list/${listId}/comments`, {
      useJWT: true,
      json: {
        text,
        replyToId: commentId
      },
    });
  }
}

export const commentService = new CommentService();
