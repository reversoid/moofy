import { useMutation } from '@tanstack/react-query';
import { BasicCommentDto, commentService } from '../api/comment.service';
import { commentLiked } from '../model';

export const useLikeComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: BasicCommentDto) => commentService.likeComment(dto),
    onSuccess(data, variables, context) {
      commentLiked({
        commentId: variables.commentId,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};

