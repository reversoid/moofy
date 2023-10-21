import {
  ListWithContentResponse,
  listService,
} from '@/features/list/api/list.service';
import { FetchError } from '@/shared/api/types/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  $searchReviews,
  setSearchReviews,
} from '../../model/listSearchContent';

import { useNewData } from '@/shared/utils/reactQueryAddons/useNewData';
import { useStore } from 'effector-react';

interface ListWithContentResponseWithSearch extends ListWithContentResponse {
  search: string;
}

export const useSearchReviews = (listId: number) => {
  const [search, setSearch] = useState('');
  const reviews = useStore($searchReviews);

  const result = useQuery<ListWithContentResponseWithSearch, FetchError>({
    queryKey: ['Search reviews', listId, search],
    queryFn: ({ pageParam, signal }) =>
      listService
        .getMyListWithContent(listId, pageParam, search, signal)
        .then((r) => ({ ...r, search })),
    enabled: false,
  });

  useEffect(() => {
    if (search) {
      result.refetch();
    } else {
      result.remove();
    }
  }, [search]);

  useNewData(result, () => {
    const reviews = result.data?.reviews.items;
    const resultSearch = result.data?.search;

    if (reviews && search === resultSearch) {
      setSearchReviews({ reviews });
    }
  });

  return {
    loading: result.isFetching,
    searchValue: search,
    setSearch,
    data: reviews,
  };
};
