import {
  ListWithContentResponse,
  listService,
} from '@/features/list/api/list.service';
import { FetchError } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { transformResponse } from '../helpers/transformResponse';
import {
  $searchReviews,
  setSearchReviews,
} from '../../model/listSearchContent';


import { useStore } from 'effector-react';
import { useNewData } from '@/shared/utils/reactQueryAddons/useNewData';

interface ListWithContentResponseWithSearch extends ListWithContentResponse {
  search: string;
}

export const useSearchReviews = (listId: number) => {
  const [search, setSearch] = useState('');
  const reviews = useStore($searchReviews);

  const result = useInfiniteQuery<
    ListWithContentResponseWithSearch,
    FetchError
  >({
    queryKey: ['Search reviews', listId, search],
    queryFn: ({ pageParam }) =>
      listService
        .getMyListWithContent(listId, pageParam, search)
        .then((r) => ({ ...r, search })),
    getNextPageParam: (lastPage) => lastPage.reviews.nextKey ?? undefined,
    enabled: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (search) {
      result.refetch();
    } else {
      result.remove();
    }
  }, [search]);

  useNewData(result, () => {
    if (result.data && isSearchFinished) {
      const updatedSearchData = transformResponse(result.data)?.reviews;
      setSearchReviews({ reviews: updatedSearchData });
    }
  });

  const isSearchFinished = result.data?.pages.at(-1)?.search === search;

  return {
    loading: result.isFetching,
    searchValue: search,
    setSearch,
    data: reviews,
    loadMore: result.fetchNextPage,
    canLoadMore: result.hasNextPage,
    loadingMore: result.isFetchingNextPage,
    isSearchFinished,
  };
};
