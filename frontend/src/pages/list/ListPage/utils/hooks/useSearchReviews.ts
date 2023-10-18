import {
  ListWithContentResponse,
  listService,
} from '@/features/list/api/list.service';
import { FetchError } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { transformResponse } from '../helpers/transformResponse';
import { setSearchList } from '../../model/listSearchContent';

interface ListWithContentResponseWithSearch extends ListWithContentResponse {
  search: string;
}

export const useSearchReviews = (listId: number) => {
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    if (result.data && search) {
      const updatedSearchData = transformResponse(result.data)?.reviews;
      setSearchList({ listId, reviews: updatedSearchData });
    }
  }, [result.data]);

  const data = result.data ? transformResponse(result.data) : undefined;

  const isSearchFinished = result.data?.pages.at(-1)?.search === search;
  return {
    loading: result.isFetching,
    searchValue: search,
    setSearch,
    data: data?.reviews,
    loadMore: result.fetchNextPage,
    canLoadMore: result.hasNextPage,
    loadingMore: result.isFetchingNextPage,
    isSearchFinished,
  };
};
