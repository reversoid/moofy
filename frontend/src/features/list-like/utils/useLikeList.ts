import { useMutation } from '@tanstack/react-query';
import { LikeUnlikeListDto, listLikeService } from '../api/list-like.service';
import { listLiked } from '../model';

export const useLikeList = () => {
  const mutation = useMutation({
    mutationFn: (dto: LikeUnlikeListDto) => listLikeService.likeList(dto),
    onSuccess(data, variables, context) {
      listLiked({
        listId: variables.listId,
      });
    },
  });
  return mutation;
};
