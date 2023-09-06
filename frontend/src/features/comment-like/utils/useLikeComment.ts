import { useMutation } from '@tanstack/react-query';
import {
  LikeUnlikeCommentDto,
  commentLikeService,
} from '../api/comment-like.service';
import { commentLiked } from '../model';

export const useLikeComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeUnlikeCommentDto) =>
      commentLikeService.likeComment(dto),
    onSuccess(data, variables, context) {
      commentLiked({
        commentId: variables.commentId,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
