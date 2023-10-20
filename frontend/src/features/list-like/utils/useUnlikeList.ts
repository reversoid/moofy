import { useMutation } from '@tanstack/react-query';
import { LikeUnlikeListDto, listLikeService } from '../api/list-like.service';
import { listUnliked } from '../model';

export const useUnlikeList = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeUnlikeListDto) => listLikeService.unlikeList(dto),
    onSuccess(data, variables, context) {
      listUnliked({
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
