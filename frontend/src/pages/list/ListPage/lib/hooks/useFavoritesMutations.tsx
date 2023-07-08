import { listService } from '@/features/list/_api/list.service';
import { addToFavorites, removeFromFavorites } from '@/features/list/favorite-lists';
import { useMutation } from '@tanstack/react-query';

export const useFavoritesMutations = () => {
  const addToFavMutation = useMutation({
    mutationFn: (listId: number) => listService.addToFavorites({ listId }),
    onSuccess(data) {
      addToFavorites({ favList: data });
    },
  });

  const removeFromFavMutation = useMutation({
    mutationFn: (listId: number) => listService.removeFromFavorites({ listId }),
    onSuccess(data) {
      removeFromFavorites(data);
    },
  });

  return { addToFavMutation, removeFromFavMutation };
};
