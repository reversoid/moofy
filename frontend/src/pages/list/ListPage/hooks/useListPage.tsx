import {
  ListWithContentResponse,
  listService,
} from '@/features/list/_api/list.service';
import { AdditinalInfo, List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { FetchError } from '@/shared/api/types/shared';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

interface NormalizedResponse {
  list: List;
  additionalInfo: AdditinalInfo
  reviews: Review[]
}

const getListWithContent = (
  data: InfiniteData<ListWithContentResponse>,
): NormalizedResponse => {
  return {
    list: data.pages.at(-1)!.list,

    additionalInfo: data.pages.at(-1)!.additionalInfo,

    reviews: data.pages.reduce((acc, page) => {
      acc.push(...page.reviews.items);
      return acc;
    }, [] as Review[]),
  };
};

export const useListPage = () => {
  const { id } = useParams();

  const { data, error, isLoading, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ListWithContentResponse, FetchError>({
      queryKey: ['Single collection page', id],
      queryFn: ({ pageParam }) =>
        listService.getMyListWithContent(Number(id), pageParam),
      getNextPageParam: (lastPage) => lastPage.reviews.nextKey ?? undefined,
    });

  return { data: data && getListWithContent(data), error, isLoading, fetchNextPage, hasNextPage };
};
