import { useMutation } from '@tanstack/react-query';
import { ReplyToCommentDto, commentService } from '../api/comment.service';
import { commentCreated } from '../model';

export const useReplyToComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: ReplyToCommentDto) => commentService.replyToComment(dto),
    onSuccess(data, variables, context) {
      commentCreated({
        comment: data,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
