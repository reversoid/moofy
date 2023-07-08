import { addToFavorites, removeFromFavorites } from '@/entities/user-fav-lists';
import { listService } from '@/features/list/_api/list.service';
import { useMutation } from '@tanstack/react-query';

export const useFavoritesMutations = () => {
  const addToFavMutation = useMutation({
    mutationFn: (listId: number) => listService.addToFavorites({ listId }),
    onSuccess(data) {
      addToFavorites(data);
    },
  });

  const removeFromFavMutation = useMutation({
    mutationFn: (listId: number) => listService.removeFromFavorites({ listId }),
    onSuccess(data) {
      removeFromFavorites({ listId: data.listId });
    },
  });

  return { addToFavMutation, removeFromFavMutation };
};
