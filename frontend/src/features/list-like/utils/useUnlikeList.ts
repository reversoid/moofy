import { useMutation } from '@tanstack/react-query';
import { LikeUnlikeListDto, listLikeService } from '../api/list-like.service';
import { commentUnliked } from '../model';

export const useUnlikeList = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeUnlikeListDto) => listLikeService.unlikeList(dto),
    onSuccess(data, variables, context) {
      commentUnliked({
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
