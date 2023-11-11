import ApiService from '@/shared/api/api.service';
import { Review } from '@/shared/api/types/review.type';
import { SearchParamsOption } from 'ky';

export type Criteria = 'ALL' | 'RANKED' | 'UNRANKED' | '';

interface SearchRandomReviewDTO {
  reviews: Review[];
}

class SearchRandomReviewService extends ApiService {
  searchRandomReviews(
    type: Criteria,
    listId: number,
    signal?: AbortSignal,
    ignoreReviewsIds?: Set<number>,
  ) {
    const ids = ignoreReviewsIds
      ? JSON.stringify(Array.from(ignoreReviewsIds))
      : undefined;

    const searchParams: SearchParamsOption = {
      listId,
      type,
    };

    if (ids) {
      searchParams['ignore'] = ids;
    }

    return super.get<SearchRandomReviewDTO>('/review/random', {
      searchParams,
      useJWT: true,
      signal,
    });
  }
}

export const searchRandomReviewService = new SearchRandomReviewService();
