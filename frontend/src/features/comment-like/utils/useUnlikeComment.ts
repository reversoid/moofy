import { useMutation } from '@tanstack/react-query';
import {
  LikeUnlikeCommentDto,
  commentLikeService,
} from '../api/comment-like.service';
import { commentUnliked } from '../model';

export const useUnlikeComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeUnlikeCommentDto) =>
      commentLikeService.unlikeComment(dto),
    onSuccess(data, variables, context) {
      commentUnliked({
        commentId: variables.commentId,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
