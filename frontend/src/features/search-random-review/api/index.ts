import ApiService from '@/shared/api/api.service';
import { Review } from '@/shared/api/types/review.type';
import { SearchParamsOption } from 'ky';

export type Critarea = 'ALL' | 'RANKED' | 'UNRANKED' | '';

interface SearchRandomReviewDTO {
  reviews: Review[];
}

class SearchRandomReviewService extends ApiService {
  searchRandomReviews(type: Critarea, listId: number) {
    const searchParams: SearchParamsOption = {
      listId,
      type,
    };

    return super.get<SearchRandomReviewDTO>('/review/random', {
      searchParams,
      useJWT: true,
    });
  }
}

export const searchRandomReviewService = new SearchRandomReviewService();
