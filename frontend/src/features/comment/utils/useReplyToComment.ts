import { useMutation } from '@tanstack/react-query';
import { CreateCommentDto, commentService } from '../api/comment.service';
import { commentCreated } from '../model';

export const useCreateComment = () => {
  const mutation = useMutation({
    mutationFn: (dto: CreateCommentDto) => commentService.createComment(dto),
    onSuccess(data, variables, context) {
      commentCreated({
        comment: data,
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
