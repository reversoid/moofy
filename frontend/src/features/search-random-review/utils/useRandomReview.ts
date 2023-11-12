import { useNewData } from '@/shared/utils/reactQueryAddons/useNewData';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Criteria, searchRandomReviewService } from '../api';
import { useSeenReviewsIds } from './use-seen-reviews-ids';
import { useEffect, useState } from 'react';
import { Review } from '@/shared/api/types/review.type';

export interface UseRandomReviewProps {
  onSeenAllReviews?: VoidFunction;
  listId: number;
}

export const useRandomReview = ({
  onSeenAllReviews,
  listId,
}: UseRandomReviewProps) => {
  const type: Criteria = 'ALL';
  const { addToSeen, seenReviewsIds, clearSeen } = useSeenReviewsIds();

  const [review, setReview] = useState<Review | null>(null);

  const result = useQuery({
    queryKey: ['Random review', type, listId],
    enabled: false,
    queryFn: ({ signal }) =>
      searchRandomReviewService.searchRandomReviews(
        type,
        Number(listId),
        signal,
        seenReviewsIds,
      ),
  });

  useNewData(result, () => {
    if (!result.data) return;

    const review = result.data.reviews[0];
    if (review) {
      setReview(review);
      addToSeen(review.id);
    } else {
      setReview(null);
      clearSeen();
      onSeenAllReviews?.();
    }
  });

  return {
    review: review,
    isLoading: result.isFetching,
    getRandomReview: result.refetch,
  };
};
