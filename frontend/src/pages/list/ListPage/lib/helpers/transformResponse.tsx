import { ListWithContentResponse } from '@/features/list/_api/list.service';
import { InfiniteData } from '@tanstack/react-query';
import { ListPageContent } from '../hooks/useListPage';
import { Review } from '@/shared/api/types/review.type';

export const transformResponse = (
  data: InfiniteData<ListWithContentResponse>,
): ListPageContent => {
  return {
    list: data.pages.at(-1)!.list,

    additionalInfo: data.pages.at(-1)!.additionalInfo,

    reviews: data.pages.reduce((acc, page) => {
      acc.push(...page.reviews.items);
      return acc;
    }, [] as Review[]),
  };
};
