import {
  ListWithContentResponse,
  listService,
} from '@/features/list/_api/list.service';
import { $singleListPage, setListPageContent } from '@/features/list/_model';
import { AdditinalInfo, List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { FetchError } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { transformResponse } from '../helpers/transformResponse';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';

export interface ListPageContent {
  list: List;
  additionalInfo: AdditinalInfo;
  reviews: Review[];
}

export const useListPage = (id: number) => {
  const listPageContent = useStore($singleListPage);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
    isFetchingNextPage,
  } = useInfiniteQuery<ListWithContentResponse, FetchError>({
    queryKey: ['Single collection page', id],
    queryFn: ({ pageParam }) =>
      listService.getMyListWithContent(Number(id), pageParam),
    getNextPageParam: (lastPage) => lastPage.reviews.nextKey ?? undefined,
  });

  useNewInfiniteData(data, isFetchingNextPage, isFetchedAfterMount, () => {
    if (data) {
      const content = transformResponse(data);
      setListPageContent({ data: content });
    }
  });

  return {
    data: listPageContent?.list.id === id ? listPageContent : undefined,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
