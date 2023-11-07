import { useQuery } from '@tanstack/react-query';
import { Critarea, searchRandomReviewService } from '../api';
import { useParams } from 'react-router-dom';

export const useRandomReview = (type: Critarea) => {
  const { id: listId } = useParams();

  const result = useQuery({
    queryKey: ['Random review', type, listId],
    queryFn: () =>
      searchRandomReviewService.searchRandomReviews(type, Number(listId)),
  });
  return {
    review: result.data?.reviews,
    isLoading: result.isFetching,
    refetch: result.refetch,
  };
};
