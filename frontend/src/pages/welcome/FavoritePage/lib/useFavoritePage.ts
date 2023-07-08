import { $userFavLists, setFavorites } from '@/entities/user-fav-lists';
import { listService } from '@/features/list/_api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';

export const useFavoritePage = () => {
  const favoriteLists = useStore($userFavLists);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
    isFetchingNextPage,
  } = useInfiniteQuery<IterableResponse<FavoriteList>, FetchError>({
    queryKey: ['Favorite collections page'],
    queryFn: ({ pageParam }) => listService.getFavoritesLists(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  useNewInfiniteData(data, isFetchingNextPage, isFetchedAfterMount, () => {
    if (data) {
      const content = transformInfiniteIterableData(data);
      setFavorites(content);
    }
  });

  return {
    data: favoriteLists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
