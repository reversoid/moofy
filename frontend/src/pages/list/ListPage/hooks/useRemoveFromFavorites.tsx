import { listService } from '@/features/list/_api/list.service';
import { useMutation } from '@tanstack/react-query';

export const useRemoveFromFavorites = () => {
  const mutation = useMutation({
    mutationFn: (listId: number) => listService.removeFromFavorites({ listId }),
    onSuccess(data, variables, context) {
        // TODO delete from store
    },
  });

  return mutation;
};
