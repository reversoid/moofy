import { UpdateListDTO, listService } from '@/features/list/_api/list.service';
import { useMutation } from '@tanstack/react-query';

export const useAddToFavorites = () => {
  const mutation = useMutation({
    mutationFn: (listId: number) => listService.addToFavorites({ listId }),
    onSuccess(data, variables, context) {
      // TODO update store
    },
  });
  return mutation;
};
