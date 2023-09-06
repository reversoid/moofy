import ApiService from '@/shared/api/api.service';

export interface LikeUnlikeCommentDto {
  listId: number;
  commentId: number;
}

export class CommentLikeService extends ApiService {
  likeComment({ commentId, listId }: LikeUnlikeCommentDto) {
    return this.put<void>(`/list/${listId}/comments/${commentId}/likes`, {
      useJWT: true,
    });
  }

  unlikeComment({ commentId, listId }: LikeUnlikeCommentDto) {
    return this.delete<void>(`/list/${listId}/comments/${commentId}/likes`, {
      useJWT: true,
    });
  }
}

export const commentLikeService = new CommentLikeService();
