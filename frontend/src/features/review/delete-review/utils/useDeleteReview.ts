import { useMutation } from '@tanstack/react-query';
import { reviewService } from '../../api/review.service';
import { deleteReview } from '../model';

export const useDeleteReview = () => {
  const mutation = useMutation({
    mutationFn: (reviewId: number) => reviewService.deleteReview(reviewId),
    onSuccess({ reviewId, list }) {
      deleteReview({ reviewId, list });
    },
  });
  return mutation;
};
