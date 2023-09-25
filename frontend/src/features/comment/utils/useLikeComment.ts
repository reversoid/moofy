import { useMutation } from '@tanstack/react-query';
import { LikeCommentDto, commentService } from '../api/comment.service';
import { commentLiked } from '../model';

export const useLikeComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeCommentDto) => commentService.likeComment(dto),
    onSuccess(data, variables, context) {
      commentLiked({
        commentId: variables.commentId,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};

