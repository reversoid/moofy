import { $userFavLists, setFavorites } from '@/entities/user-fav-lists';
import { listService } from '@/features/list/api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';

export const useFavoritePage = () => {
  const favoriteLists = useStore($userFavLists);

  const result = useInfiniteQuery<IterableResponse<FavoriteList>, FetchError>({
    queryKey: ['Favorite collections page'],
    queryFn: ({ pageParam }) => listService.getFavoritesLists(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      if (!favoriteLists) {
        setFavorites(content);
      }
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setFavorites(content);
    }
  });

  return {
    data: favoriteLists,
    isLoading: result.isLoading,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};
