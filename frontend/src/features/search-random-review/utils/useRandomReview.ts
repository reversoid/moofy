import { useNewData } from '@/shared/utils/reactQueryAddons/useNewData';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Criteria, searchRandomReviewService } from '../api';
import { useSeenReviewsIds } from './use-seen-reviews-ids';

export interface UseRandomReviewProps {
  type: Criteria;
  onSeenAllReviews?: VoidFunction;
}

export const useRandomReview = ({
  onSeenAllReviews,
  type,
}: UseRandomReviewProps) => {
  const { id: listId } = useParams();
  const { addToSeen, seenReviewsIds, clearSeen } = useSeenReviewsIds();

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
      addToSeen(review.id);
    } else {
      clearSeen();
      onSeenAllReviews?.();
    }
  });

  return {
    review: result.data?.reviews?.[0],
    isLoading: result.isFetching,
    refetch: result.refetch,
  };
};
