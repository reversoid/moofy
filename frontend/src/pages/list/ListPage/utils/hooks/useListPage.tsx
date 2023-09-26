import {
  ListWithContentResponse,
  listService,
} from '@/features/list/api/list.service';
import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { FetchError } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';
import { transformResponse } from '../helpers/transformResponse';
import { useNewInfiniteData } from '@/shared/utils/reactQueryAddons/useNewInfiniteData';
import { useCachedInfiniteData } from '@/shared/utils/reactQueryAddons/useCachedInfiniteData';
import {
  $singleListPage,
  setListPageContent,
} from '../../model/listPageContent';
import { useViewList } from './useViewList';

export interface ListPageContent extends ListWithAdditionalInfo {
  reviews: Review[];
}

export const useListPage = (id: number) => {
  const listPageContent = useStore($singleListPage);

  const result = useInfiniteQuery<ListWithContentResponse, FetchError>({
    queryKey: ['Single collection page', id],
    queryFn: ({ pageParam }) =>
      listService.getMyListWithContent(Number(id), pageParam),
    getNextPageParam: (lastPage) => lastPage.reviews.nextKey ?? undefined,
  });

  useViewList(id);

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformResponse(result.data);
      if (!listPageContent) {
        setListPageContent({ data: content });
      }
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformResponse(result.data);
      setListPageContent({ data: content });
    }
  });

  return {
    data: listPageContent?.list.id === id ? listPageContent : undefined,
    error: result.error,
    isLoading: result.isLoading || result.isRefetching,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};
