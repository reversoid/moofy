import { useMutation } from '@tanstack/react-query';
import { LikeCommentDto, commentService } from '../api/comment.service';
import { commentUnliked } from '../model';

export const useUnlikeComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeCommentDto) => commentService.unlikeComment(dto),
    onSuccess(data, variables, context) {
      commentUnliked({
        commentId: variables.commentId,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
