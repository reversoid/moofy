import { $userFavLists, setFavorites } from '@/entities/user-fav-lists';
import { listService } from '@/features/list/_api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteData } from '@/shared/lib/pagination/transformInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';
import { useEffect } from 'react';

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

  useEffect(() => {
    // TODO maybe create hook for doubling this logic?
    const isOutdated = !data || isFetchingNextPage || !isFetchedAfterMount;
    if (isOutdated) {
      return;
    }

    const content = transformInfiniteData(data);
    setFavorites(content);
  }, [isFetchedAfterMount, isFetchingNextPage]);

  return {
    data: favoriteLists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
