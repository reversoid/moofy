import { useMutation } from '@tanstack/react-query';
import { BasicCommentDto, commentService } from '../api/comment.service';
import { commentUnliked } from '../model';

export const useUnlikeComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: BasicCommentDto) => commentService.unlikeComment(dto),
    onSuccess(data, variables, context) {
      commentUnliked({
        commentId: variables.commentId,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
